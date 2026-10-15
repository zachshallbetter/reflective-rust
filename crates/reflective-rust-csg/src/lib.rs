//! Exchange model for compiler-produced semantic graphs.
//!
//! A graph is compiler-certified only when a named compiler extractor supplies
//! its provenance. Hand-authored data must use `GraphProvenance::Fixture`.

use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
use ed25519_dalek::{Signature, Signer, SigningKey, VerifyingKey};
use reflective_rust_protocol::AccessLevel;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::BTreeSet;
use std::fmt;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};

pub const CSG_SCHEMA_VERSION: &str = "rr-csg-0.1";
pub const CSG_SIGNATURE_DOMAIN: &[u8] = b"reflective-rust:csg:ed25519:v1\0";

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CompilerCertification {
    pub issuer_key_id: String,
    pub signature: String,
    pub certified_at: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(tag = "kind", rename_all = "kebab-case", deny_unknown_fields)]
pub enum GraphProvenance {
    Compiler {
        compiler: String,
        backend: String,
        extractor: String,
        source_hash: String,
    },
    Fixture {
        source: String,
    },
}

impl GraphProvenance {
    pub const fn is_compiler_certified(&self) -> bool {
        matches!(self, Self::Compiler { .. })
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct SourceSpan {
    pub file: String,
    pub start_line: u32,
    pub end_line: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum CsgNodeKind {
    Crate,
    Module,
    Struct,
    Enum,
    Field,
    Function,
    Trait,
    Impl,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CsgNode {
    pub id: String,
    pub name: String,
    pub kind: CsgNodeKind,
    pub span: SourceSpan,
    pub minimum_access: AccessLevel,
    pub size_bytes: Option<usize>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CsgEdge {
    pub from: String,
    pub to: String,
    pub relationship: String,
    pub minimum_access: AccessLevel,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CompilerSemanticGraph {
    pub schema_version: String,
    pub provenance: GraphProvenance,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub certification: Option<CompilerCertification>,
    pub nodes: Vec<CsgNode>,
    pub edges: Vec<CsgEdge>,
}

impl CompilerSemanticGraph {
    pub fn fixture(source: impl Into<String>) -> Self {
        Self {
            schema_version: CSG_SCHEMA_VERSION.into(),
            provenance: GraphProvenance::Fixture {
                source: source.into(),
            },
            certification: None,
            nodes: Vec::new(),
            edges: Vec::new(),
        }
    }

    pub fn is_compiler_certified(&self) -> bool {
        self.certification.is_some() && self.provenance.is_compiler_certified()
    }

    pub fn validate(&self) -> Result<(), ValidationError> {
        if self.schema_version != CSG_SCHEMA_VERSION {
            return Err(ValidationError::UnsupportedSchema(
                self.schema_version.clone(),
            ));
        }
        match &self.provenance {
            GraphProvenance::Compiler {
                compiler,
                backend,
                extractor,
                source_hash,
            } => {
                if [compiler, backend, extractor]
                    .into_iter()
                    .any(|value| value.trim().is_empty())
                {
                    return Err(ValidationError::InvalidProvenance);
                }
                let Some(digest) = source_hash.strip_prefix("sha256:") else {
                    return Err(ValidationError::InvalidProvenance);
                };
                if digest.len() != 64
                    || !digest
                        .bytes()
                        .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
                {
                    return Err(ValidationError::InvalidProvenance);
                }
            }
            GraphProvenance::Fixture { source } if source.trim().is_empty() => {
                return Err(ValidationError::InvalidProvenance);
            }
            GraphProvenance::Fixture { .. } => {}
        }
        if let Some(cert) = &self.certification {
            if matches!(self.provenance, GraphProvenance::Fixture { .. }) {
                return Err(ValidationError::FixtureCannotBeCertified);
            }
            if cert.issuer_key_id.trim().is_empty() || cert.signature.trim().is_empty() {
                return Err(ValidationError::InvalidCertification);
            }
            let certified_at = OffsetDateTime::parse(&cert.certified_at, &Rfc3339)
                .map_err(|_| ValidationError::InvalidCertification)?;
            if let Some(exp) = &cert.expires_at {
                let expires_at = OffsetDateTime::parse(exp, &Rfc3339)
                    .map_err(|_| ValidationError::InvalidCertification)?;
                if expires_at <= certified_at {
                    return Err(ValidationError::InvalidCertification);
                }
            }
        }
        let mut ids = BTreeSet::new();
        for node in &self.nodes {
            if node.id.trim().is_empty()
                || node.name.trim().is_empty()
                || node.span.file.trim().is_empty()
            {
                return Err(ValidationError::EmptyNodeIdentity);
            }
            if !ids.insert(node.id.as_str()) {
                return Err(ValidationError::DuplicateNode(node.id.clone()));
            }
            if node.span.start_line > node.span.end_line {
                return Err(ValidationError::InvalidSpan(node.id.clone()));
            }
        }
        for edge in &self.edges {
            if !ids.contains(edge.from.as_str()) {
                return Err(ValidationError::DanglingEdge(edge.from.clone()));
            }
            if !ids.contains(edge.to.as_str()) {
                return Err(ValidationError::DanglingEdge(edge.to.clone()));
            }
            if edge.relationship.trim().is_empty() {
                return Err(ValidationError::EmptyRelationship);
            }
        }
        Ok(())
    }

    pub fn to_json(&self) -> Result<String, GraphError> {
        self.validate().map_err(GraphError::Validation)?;
        serde_json::to_string_pretty(self).map_err(GraphError::Serialization)
    }

    pub fn from_json(json: &str) -> Result<Self, GraphError> {
        let graph: Self = serde_json::from_str(json).map_err(GraphError::Serialization)?;
        graph.validate().map_err(GraphError::Validation)?;
        Ok(graph)
    }

    pub fn canonical_json(&self) -> Result<String, GraphError> {
        self.validate().map_err(GraphError::Validation)?;
        let bytes = serde_jcs::to_vec(self).map_err(GraphError::Serialization)?;
        String::from_utf8(bytes).map_err(|e| GraphError::Utf8(e.utf8_error()))
    }

    pub fn canonical_hash(&self) -> Result<String, GraphError> {
        let json = self.canonical_json()?;
        Ok(format!("sha256:{:x}", Sha256::digest(json.as_bytes())))
    }

    /// Computes the content hash of normalized nodes and edges, independent of volatile metadata or signatures.
    pub fn content_hash(&self) -> Result<String, GraphError> {
        self.validate().map_err(GraphError::Validation)?;
        let mut sorted_nodes = self.nodes.clone();
        sorted_nodes.sort_by(|a, b| a.id.cmp(&b.id));
        let mut sorted_edges = self.edges.clone();
        sorted_edges.sort_by(|a, b| {
            (&a.from, &a.to, &a.relationship).cmp(&(&b.from, &b.to, &b.relationship))
        });
        #[derive(Serialize)]
        struct NormalizedContent<'a> {
            schema_version: &'a str,
            nodes: &'a [CsgNode],
            edges: &'a [CsgEdge],
        }
        let content = NormalizedContent {
            schema_version: &self.schema_version,
            nodes: &sorted_nodes,
            edges: &sorted_edges,
        };
        let bytes = serde_jcs::to_vec(&content).map_err(GraphError::Serialization)?;
        Ok(format!("sha256:{:x}", Sha256::digest(&bytes)))
    }

    pub fn sign_certification(
        &mut self,
        issuer_key_id: impl Into<String>,
        signing_key: &SigningKey,
        certified_at: OffsetDateTime,
        expires_at: Option<OffsetDateTime>,
    ) -> Result<(), GraphError> {
        if matches!(self.provenance, GraphProvenance::Fixture { .. }) {
            return Err(GraphError::Validation(
                ValidationError::FixtureCannotBeCertified,
            ));
        }
        self.certification = None;
        let content_hash = self.content_hash()?;
        let issuer_key_id = issuer_key_id.into();
        let certified_at_str = certified_at
            .format(&Rfc3339)
            .map_err(|_| GraphError::Validation(ValidationError::InvalidCertification))?;
        let expires_at_str = expires_at
            .map(|t| t.format(&Rfc3339))
            .transpose()
            .map_err(|_| GraphError::Validation(ValidationError::InvalidCertification))?;

        let mut payload = Vec::new();
        payload.extend_from_slice(CSG_SIGNATURE_DOMAIN);
        payload.extend_from_slice(issuer_key_id.as_bytes());
        payload.push(0);
        payload.extend_from_slice(content_hash.as_bytes());
        payload.push(0);
        payload.extend_from_slice(certified_at_str.as_bytes());

        let signature = signing_key.sign(&payload);
        self.certification = Some(CompilerCertification {
            issuer_key_id,
            signature: URL_SAFE_NO_PAD.encode(signature.to_bytes()),
            certified_at: certified_at_str,
            expires_at: expires_at_str,
        });
        Ok(())
    }

    pub fn verify_certification(
        &self,
        expected_issuer_key_id: &str,
        verifying_key: &VerifyingKey,
        now: Option<OffsetDateTime>,
    ) -> Result<(), CertificationError> {
        let cert = self
            .certification
            .as_ref()
            .ok_or(CertificationError::Uncertified)?;
        if matches!(self.provenance, GraphProvenance::Fixture { .. }) {
            return Err(CertificationError::FixtureCannotBeCertified);
        }
        if cert.issuer_key_id != expected_issuer_key_id {
            return Err(CertificationError::UnexpectedIssuer {
                expected: expected_issuer_key_id.to_string(),
                actual: cert.issuer_key_id.clone(),
            });
        }
        let certified_at = OffsetDateTime::parse(&cert.certified_at, &Rfc3339)
            .map_err(|_| CertificationError::InvalidTimestamp)?;
        if let Some(exp_str) = &cert.expires_at {
            let expires_at = OffsetDateTime::parse(exp_str, &Rfc3339)
                .map_err(|_| CertificationError::InvalidTimestamp)?;
            if now.is_some_and(|current_time| current_time >= expires_at) {
                return Err(CertificationError::Expired);
            }
        }
        if now.is_some_and(|current_time| current_time < certified_at) {
            return Err(CertificationError::NotYetValid);
        }
        let content_hash = self
            .content_hash()
            .map_err(|e| CertificationError::Graph(e.to_string()))?;
        let mut payload = Vec::new();
        payload.extend_from_slice(CSG_SIGNATURE_DOMAIN);
        payload.extend_from_slice(cert.issuer_key_id.as_bytes());
        payload.push(0);
        payload.extend_from_slice(content_hash.as_bytes());
        payload.push(0);
        payload.extend_from_slice(cert.certified_at.as_bytes());

        let sig_bytes = URL_SAFE_NO_PAD
            .decode(&cert.signature)
            .map_err(|_| CertificationError::MalformedSignature)?;
        let signature = Signature::from_slice(&sig_bytes)
            .map_err(|_| CertificationError::MalformedSignature)?;
        verifying_key
            .verify_strict(&payload, &signature)
            .map_err(|_| CertificationError::InvalidSignature)
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ValidationError {
    UnsupportedSchema(String),
    InvalidProvenance,
    EmptyNodeIdentity,
    DuplicateNode(String),
    InvalidSpan(String),
    DanglingEdge(String),
    EmptyRelationship,
    FixtureCannotBeCertified,
    InvalidCertification,
}

impl fmt::Display for ValidationError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "{self:?}")
    }
}

impl std::error::Error for ValidationError {}

#[derive(Debug)]
pub enum GraphError {
    Validation(ValidationError),
    Serialization(serde_json::Error),
    Utf8(std::str::Utf8Error),
}

impl fmt::Display for GraphError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Validation(error) => error.fmt(formatter),
            Self::Serialization(error) => error.fmt(formatter),
            Self::Utf8(error) => error.fmt(formatter),
        }
    }
}

impl std::error::Error for GraphError {}

#[derive(Debug, PartialEq, Eq)]
pub enum CertificationError {
    Uncertified,
    FixtureCannotBeCertified,
    UnexpectedIssuer { expected: String, actual: String },
    MalformedSignature,
    InvalidSignature,
    NotYetValid,
    Expired,
    InvalidTimestamp,
    Graph(String),
}

impl fmt::Display for CertificationError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(formatter, "{self:?}")
    }
}

impl std::error::Error for CertificationError {}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn fixture_round_trips_without_claiming_compiler_certification() {
        let graph = CompilerSemanticGraph::fixture("unit-test");
        assert!(!graph.provenance.is_compiler_certified());
        let json = graph.to_json().unwrap();
        assert_eq!(CompilerSemanticGraph::from_json(&json).unwrap(), graph);
    }

    #[test]
    fn dangling_edges_are_rejected() {
        let mut graph = CompilerSemanticGraph::fixture("unit-test");
        graph.edges.push(CsgEdge {
            from: "missing".into(),
            to: "also-missing".into(),
            relationship: "contains".into(),
            minimum_access: AccessLevel::Public,
        });
        assert_eq!(
            graph.validate(),
            Err(ValidationError::DanglingEdge("missing".into()))
        );
    }

    #[test]
    fn compiler_provenance_requires_a_source_digest() {
        let mut graph = CompilerSemanticGraph::fixture("unit-test");
        graph.provenance = GraphProvenance::Compiler {
            compiler: "rustc".into(),
            backend: "llvm".into(),
            extractor: "reflective-rust".into(),
            source_hash: "unverified".into(),
        };
        assert_eq!(graph.validate(), Err(ValidationError::InvalidProvenance));
    }

    #[test]
    fn content_hash_is_order_independent() {
        let node_a = CsgNode {
            id: "node:a".into(),
            name: "NodeA".into(),
            kind: CsgNodeKind::Struct,
            span: SourceSpan {
                file: "lib.rs".into(),
                start_line: 1,
                end_line: 10,
            },
            minimum_access: AccessLevel::Public,
            size_bytes: Some(16),
        };
        let node_b = CsgNode {
            id: "node:b".into(),
            name: "NodeB".into(),
            kind: CsgNodeKind::Function,
            span: SourceSpan {
                file: "lib.rs".into(),
                start_line: 12,
                end_line: 20,
            },
            minimum_access: AccessLevel::Public,
            size_bytes: None,
        };
        let edge_ab = CsgEdge {
            from: "node:a".into(),
            to: "node:b".into(),
            relationship: "calls".into(),
            minimum_access: AccessLevel::Public,
        };

        let mut g1 = CompilerSemanticGraph::fixture("test");
        g1.nodes = vec![node_a.clone(), node_b.clone()];
        g1.edges = vec![edge_ab.clone()];

        let mut g2 = CompilerSemanticGraph::fixture("test");
        g2.nodes = vec![node_b, node_a];
        g2.edges = vec![edge_ab];

        assert_eq!(g1.content_hash().unwrap(), g2.content_hash().unwrap());
    }

    #[test]
    fn compiler_certification_signs_and_verifies_authenticity() {
        let signing_key = SigningKey::from_bytes(&[7u8; 32]);
        let verifying_key = signing_key.verifying_key();

        let mut graph = CompilerSemanticGraph {
            schema_version: CSG_SCHEMA_VERSION.into(),
            provenance: GraphProvenance::Compiler {
                compiler: "rustc".into(),
                backend: "llvm".into(),
                extractor: "reflective-rust-extractor".into(),
                source_hash:
                    "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef".into(),
            },
            certification: None,
            nodes: vec![CsgNode {
                id: "crate:main".into(),
                name: "main".into(),
                kind: CsgNodeKind::Crate,
                span: SourceSpan {
                    file: "main.rs".into(),
                    start_line: 1,
                    end_line: 100,
                },
                minimum_access: AccessLevel::Public,
                size_bytes: None,
            }],
            edges: vec![],
        };

        let now = OffsetDateTime::now_utc();
        let expires = now + time::Duration::days(30);

        graph
            .sign_certification("compiler-key-1", &signing_key, now, Some(expires))
            .unwrap();

        assert!(graph.is_compiler_certified());
        assert!(
            graph
                .verify_certification("compiler-key-1", &verifying_key, Some(now))
                .is_ok()
        );

        // Key substitution rejected
        assert_eq!(
            graph.verify_certification("compiler-key-wrong", &verifying_key, Some(now)),
            Err(CertificationError::UnexpectedIssuer {
                expected: "compiler-key-wrong".into(),
                actual: "compiler-key-1".into()
            })
        );

        // Expired certification rejected
        let future = expires + time::Duration::days(1);
        assert_eq!(
            graph.verify_certification("compiler-key-1", &verifying_key, Some(future)),
            Err(CertificationError::Expired)
        );

        // Not-yet-valid rejected
        let past = now - time::Duration::days(1);
        assert_eq!(
            graph.verify_certification("compiler-key-1", &verifying_key, Some(past)),
            Err(CertificationError::NotYetValid)
        );

        // Tampered graph content rejected
        let mut tampered = graph.clone();
        tampered.nodes[0].name = "tampered_crate".into();
        assert_eq!(
            tampered.verify_certification("compiler-key-1", &verifying_key, Some(now)),
            Err(CertificationError::InvalidSignature)
        );
    }

    #[test]
    fn fixture_cannot_claim_compiler_certification() {
        let signing_key = SigningKey::from_bytes(&[9u8; 32]);
        let mut graph = CompilerSemanticGraph::fixture("test-fixture");
        let now = OffsetDateTime::now_utc();
        assert!(matches!(
            graph.sign_certification("key-1", &signing_key, now, None),
            Err(GraphError::Validation(
                ValidationError::FixtureCannotBeCertified
            ))
        ));
    }
}
