//! Canonical Runtime Semantic Projection (RSP) and Operational Semantic Graph
//! (OSG) protocol.
//!
//! This crate describes runtime-visible facts. It does not implement compiler
//! semantic reflection and does not represent its values as compiler-certified
//! unless an actual compiler integration supplies that provenance.

use base64::{Engine as _, engine::general_purpose::URL_SAFE_NO_PAD};
use ed25519_dalek::{Signature, Signer, SigningKey, VerifyingKey};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::collections::{BTreeMap, BTreeSet};
use std::fmt;
use time::{OffsetDateTime, format_description::well_known::Rfc3339};

pub const SCHEMA_VERSION: &str = "rr-rsp-0.1";
const SIGNATURE_DOMAIN: &[u8] = b"reflective-rust:rsp:ed25519:v1\0";

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ProjectionKind {
    CompilerCertified,
    Declared,
    Derived,
    Observed,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum AccessLevel {
    Public,
    Member,
    Owner,
    Administrator,
}

impl AccessLevel {
    pub const fn permits(self, required: Self) -> bool {
        self as u8 >= required as u8
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Provenance {
    pub kind: ProjectionKind,
    pub authority: String,
    pub source: String,
    pub source_hash: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub observed_at: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct Compatibility {
    pub protocol: String,
    pub subject_schema: String,
}

impl Compatibility {
    pub fn new(subject_schema: impl Into<String>) -> Self {
        Self {
            protocol: SCHEMA_VERSION.to_string(),
            subject_schema: subject_schema.into(),
        }
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(
    tag = "descriptor_kind",
    content = "descriptor",
    rename_all = "kebab-case",
    deny_unknown_fields
)]
pub enum DescriptorBody {
    Type(TypeDescriptor),
    Runtime(RuntimeDescriptor),
    Observation(ObservationDescriptor),
    OperationalGraph(OperationalSemanticGraph),
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct DescriptorEnvelope {
    pub schema_version: String,
    pub subject_id: String,
    pub compatibility: Compatibility,
    pub provenance: Provenance,
    pub minimum_access: AccessLevel,
    pub body: DescriptorBody,
}

impl DescriptorEnvelope {
    pub fn new(
        subject_id: impl Into<String>,
        subject_schema: impl Into<String>,
        provenance: Provenance,
        minimum_access: AccessLevel,
        body: DescriptorBody,
    ) -> Result<Self, ValidationError> {
        let envelope = Self {
            schema_version: SCHEMA_VERSION.to_string(),
            subject_id: subject_id.into(),
            compatibility: Compatibility::new(subject_schema),
            provenance,
            minimum_access,
            body,
        };
        envelope.validate()?;
        Ok(envelope)
    }

    pub fn validate(&self) -> Result<(), ValidationError> {
        require_identifier("subject_id", &self.subject_id)?;
        require_nonempty("provenance.authority", &self.provenance.authority)?;
        require_nonempty("provenance.source", &self.provenance.source)?;
        require_sha256("provenance.source_hash", &self.provenance.source_hash)?;
        if self.schema_version != SCHEMA_VERSION {
            return Err(ValidationError::UnsupportedSchema(
                self.schema_version.clone(),
            ));
        }
        if self.compatibility.protocol != SCHEMA_VERSION {
            return Err(ValidationError::UnsupportedSchema(
                self.compatibility.protocol.clone(),
            ));
        }
        require_nonempty(
            "compatibility.subject_schema",
            &self.compatibility.subject_schema,
        )?;
        match self.provenance.kind {
            ProjectionKind::Observed => {
                let observed_at = parse_timestamp(
                    "provenance.observed_at",
                    self.provenance.observed_at.as_deref(),
                )?;
                let expires_at = parse_timestamp(
                    "provenance.expires_at",
                    self.provenance.expires_at.as_deref(),
                )?;
                if expires_at <= observed_at {
                    return Err(ValidationError::InvalidFreshnessWindow);
                }
                if !matches!(self.body, DescriptorBody::Observation(_)) {
                    return Err(ValidationError::IncompatibleProvenance);
                }
            }
            _ if self.provenance.observed_at.is_some() || self.provenance.expires_at.is_some() => {
                return Err(ValidationError::IncompatibleProvenance);
            }
            _ if matches!(self.body, DescriptorBody::Observation(_)) => {
                return Err(ValidationError::IncompatibleProvenance);
            }
            _ => {}
        }
        match &self.body {
            DescriptorBody::Type(value) => value.validate(),
            DescriptorBody::Runtime(value) => value.validate(),
            DescriptorBody::Observation(value) => value.validate(),
            DescriptorBody::OperationalGraph(value) => value.validate(),
        }
    }

    pub fn project_for(&self, access: AccessLevel) -> Option<Self> {
        if !access.permits(self.minimum_access) {
            return None;
        }
        let mut projected = self.clone();
        match &mut projected.body {
            DescriptorBody::Type(value) => {
                value
                    .fields
                    .retain(|field| access.permits(field.minimum_access));
                for variant in &mut value.variants {
                    variant
                        .fields
                        .retain(|field| access.permits(field.minimum_access));
                }
            }
            DescriptorBody::Runtime(value) => value
                .capabilities
                .retain(|capability| access.permits(capability.minimum_access)),
            DescriptorBody::OperationalGraph(value) => value.project_for(access),
            DescriptorBody::Observation(_) => {}
        }
        Some(projected)
    }

    pub fn canonical_json(&self) -> Result<String, CanonicalError> {
        self.validate().map_err(CanonicalError::Validation)?;
        let bytes = serde_jcs::to_vec(self).map_err(CanonicalError::Serialization)?;
        String::from_utf8(bytes).map_err(CanonicalError::Utf8)
    }

    pub fn canonical_hash(&self) -> Result<String, CanonicalError> {
        let bytes = self.canonical_json()?;
        Ok(format!("sha256:{:x}", Sha256::digest(bytes.as_bytes())))
    }

    pub fn require_compatible(&self, other: &Self) -> Result<(), CompatibilityError> {
        if self.compatibility.protocol != other.compatibility.protocol {
            return Err(CompatibilityError::Protocol {
                expected: self.compatibility.protocol.clone(),
                actual: other.compatibility.protocol.clone(),
            });
        }
        if self.compatibility.subject_schema != other.compatibility.subject_schema {
            return Err(CompatibilityError::SubjectSchema {
                expected: self.compatibility.subject_schema.clone(),
                actual: other.compatibility.subject_schema.clone(),
            });
        }
        Ok(())
    }

    pub fn require_fresh_at(&self, now: OffsetDateTime) -> Result<(), FreshnessError> {
        self.validate().map_err(FreshnessError::Validation)?;
        if self.provenance.kind != ProjectionKind::Observed {
            return Ok(());
        }
        let observed_at = parse_timestamp(
            "provenance.observed_at",
            self.provenance.observed_at.as_deref(),
        )
        .map_err(FreshnessError::Validation)?;
        let expires_at = parse_timestamp(
            "provenance.expires_at",
            self.provenance.expires_at.as_deref(),
        )
        .map_err(FreshnessError::Validation)?;
        if now < observed_at {
            return Err(FreshnessError::NotYetValid);
        }
        if now >= expires_at {
            return Err(FreshnessError::Expired);
        }
        Ok(())
    }

    pub fn sign(
        &self,
        key_id: impl Into<String>,
        signing_key: &SigningKey,
    ) -> Result<AuthenticatedEnvelope, AuthenticationError> {
        let key_id = key_id.into();
        require_identifier("signature.key_id", &key_id).map_err(AuthenticationError::Validation)?;
        let payload = signature_payload(&key_id, self)?;
        let signature = signing_key.sign(&payload);
        Ok(AuthenticatedEnvelope {
            envelope: self.clone(),
            authentication: EnvelopeAuthentication {
                algorithm: SignatureAlgorithm::Ed25519,
                key_id,
                signature: URL_SAFE_NO_PAD.encode(signature.to_bytes()),
            },
        })
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum SignatureAlgorithm {
    Ed25519,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct EnvelopeAuthentication {
    pub algorithm: SignatureAlgorithm,
    pub key_id: String,
    pub signature: String,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct AuthenticatedEnvelope {
    pub envelope: DescriptorEnvelope,
    pub authentication: EnvelopeAuthentication,
}

impl AuthenticatedEnvelope {
    pub fn verify(
        &self,
        expected_key_id: &str,
        verifying_key: &VerifyingKey,
    ) -> Result<(), AuthenticationError> {
        if self.authentication.key_id != expected_key_id {
            return Err(AuthenticationError::UnexpectedKey {
                expected: expected_key_id.into(),
                actual: self.authentication.key_id.clone(),
            });
        }
        let bytes = URL_SAFE_NO_PAD
            .decode(&self.authentication.signature)
            .map_err(|_| AuthenticationError::MalformedSignature)?;
        let signature =
            Signature::from_slice(&bytes).map_err(|_| AuthenticationError::MalformedSignature)?;
        let payload = signature_payload(&self.authentication.key_id, &self.envelope)?;
        verifying_key
            .verify_strict(&payload, &signature)
            .map_err(|_| AuthenticationError::InvalidSignature)
    }
}

fn signature_payload(
    key_id: &str,
    envelope: &DescriptorEnvelope,
) -> Result<Vec<u8>, AuthenticationError> {
    let canonical = envelope
        .canonical_json()
        .map_err(AuthenticationError::Canonical)?;
    let mut payload =
        Vec::with_capacity(SIGNATURE_DOMAIN.len() + key_id.len() + canonical.len() + 1);
    payload.extend_from_slice(SIGNATURE_DOMAIN);
    payload.extend_from_slice(key_id.as_bytes());
    payload.push(0);
    payload.extend_from_slice(canonical.as_bytes());
    Ok(payload)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TypeKind {
    Struct,
    Enum,
    Union,
    Tuple,
    Primitive,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct TypeDescriptor {
    pub name: String,
    pub kind: TypeKind,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub layout: Option<LayoutDescriptor>,
    #[serde(default)]
    pub fields: Vec<FieldDescriptor>,
    #[serde(default)]
    pub variants: Vec<VariantDescriptor>,
}

impl TypeDescriptor {
    fn validate(&self) -> Result<(), ValidationError> {
        require_nonempty("type.name", &self.name)?;
        unique("field", self.fields.iter().map(|field| field.name.as_str()))?;
        unique(
            "variant",
            self.variants.iter().map(|variant| variant.name.as_str()),
        )?;
        for field in &self.fields {
            field.validate()?;
        }
        for variant in &self.variants {
            variant.validate()?;
        }
        if self.layout.is_some_and(|layout| layout.align_bytes == 0) {
            return Err(ValidationError::InvalidValue {
                field: "type.layout.align_bytes",
                value: "0".into(),
            });
        }
        match self.kind {
            TypeKind::Enum if !self.fields.is_empty() => {
                return Err(ValidationError::IncompatibleTypeShape);
            }
            TypeKind::Struct | TypeKind::Union | TypeKind::Tuple if !self.variants.is_empty() => {
                return Err(ValidationError::IncompatibleTypeShape);
            }
            TypeKind::Primitive if !self.fields.is_empty() || !self.variants.is_empty() => {
                return Err(ValidationError::IncompatibleTypeShape);
            }
            _ => {}
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct LayoutDescriptor {
    pub size_bytes: usize,
    pub align_bytes: usize,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct FieldDescriptor {
    pub name: String,
    pub type_name: String,
    pub optional: bool,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub offset_bytes: Option<usize>,
    pub minimum_access: AccessLevel,
    #[serde(default)]
    pub attributes: BTreeMap<String, String>,
}

impl FieldDescriptor {
    fn validate(&self) -> Result<(), ValidationError> {
        require_identifier("field.name", &self.name)?;
        require_nonempty("field.type_name", &self.type_name)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VariantDescriptor {
    pub name: String,
    #[serde(default)]
    pub fields: Vec<FieldDescriptor>,
}

impl VariantDescriptor {
    fn validate(&self) -> Result<(), ValidationError> {
        require_identifier("variant.name", &self.name)?;
        unique(
            "variant field",
            self.fields.iter().map(|field| field.name.as_str()),
        )?;
        for field in &self.fields {
            field.validate()?;
        }
        Ok(())
    }
}

pub trait Reflect {
    fn type_descriptor() -> TypeDescriptor;
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Modality {
    Text,
    Image,
    Audio,
    Video,
    StructuredData,
    File,
    Binary,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct CapabilityDescriptor {
    pub id: String,
    pub description: String,
    pub endpoint: String,
    #[serde(default)]
    pub inputs: Vec<Modality>,
    #[serde(default)]
    pub outputs: Vec<Modality>,
    pub streaming: bool,
    pub minimum_access: AccessLevel,
}

impl CapabilityDescriptor {
    fn validate(&self) -> Result<(), ValidationError> {
        require_identifier("capability.id", &self.id)?;
        require_nonempty("capability.description", &self.description)?;
        if !self.endpoint.starts_with('/') {
            return Err(ValidationError::InvalidValue {
                field: "capability.endpoint",
                value: self.endpoint.clone(),
            });
        }
        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct RuntimeDescriptor {
    pub name: String,
    pub version: String,
    pub authority_class: String,
    #[serde(default)]
    pub capabilities: Vec<CapabilityDescriptor>,
}

impl RuntimeDescriptor {
    fn validate(&self) -> Result<(), ValidationError> {
        require_identifier("runtime.name", &self.name)?;
        require_nonempty("runtime.version", &self.version)?;
        require_nonempty("runtime.authority_class", &self.authority_class)?;
        unique(
            "capability",
            self.capabilities
                .iter()
                .map(|capability| capability.id.as_str()),
        )?;
        for capability in &self.capabilities {
            capability.validate()?;
        }
        Ok(())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum ObservationStatus {
    Synchronized,
    Drifted,
    Missing,
    Unavailable,
    Unknown,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct ObservationDescriptor {
    pub target_id: String,
    pub status: ObservationStatus,
    #[serde(default)]
    pub facts: BTreeMap<String, serde_json::Value>,
    #[serde(default)]
    pub differences: Vec<String>,
}

impl ObservationDescriptor {
    fn validate(&self) -> Result<(), ValidationError> {
        require_identifier("observation.target_id", &self.target_id)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum OperationalNodeKind {
    Runtime,
    Capability,
    Authority,
    Contract,
    DataStore,
    Provider,
    Model,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct OperationalNode {
    pub id: String,
    pub label: String,
    pub kind: OperationalNodeKind,
    pub minimum_access: AccessLevel,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct OperationalEdge {
    pub from: String,
    pub to: String,
    pub relationship: String,
    pub minimum_access: AccessLevel,
}

#[derive(Debug, Clone, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct OperationalSemanticGraph {
    pub nodes: Vec<OperationalNode>,
    pub edges: Vec<OperationalEdge>,
}

impl OperationalSemanticGraph {
    /// Derives operational topology from declared runtime manifests.
    ///
    /// The result is derived data. Its enclosing envelope must retain that
    /// provenance rather than describing the graph as compiler-certified.
    pub fn from_runtime_descriptors(
        runtimes: &[(RuntimeDescriptor, AccessLevel)],
    ) -> Result<Self, ValidationError> {
        let mut graph = Self::default();
        for (runtime, runtime_access) in runtimes {
            runtime.validate()?;
            let runtime_id = format!("runtime:{}", runtime.name);
            graph.nodes.push(OperationalNode {
                id: runtime_id.clone(),
                label: runtime.name.clone(),
                kind: OperationalNodeKind::Runtime,
                minimum_access: *runtime_access,
            });
            for capability in &runtime.capabilities {
                let capability_id = format!("capability:{}:{}", runtime.name, capability.id);
                graph.nodes.push(OperationalNode {
                    id: capability_id.clone(),
                    label: capability.description.clone(),
                    kind: OperationalNodeKind::Capability,
                    minimum_access: (*runtime_access).max(capability.minimum_access),
                });
                graph.edges.push(OperationalEdge {
                    from: runtime_id.clone(),
                    to: capability_id,
                    relationship: "offers".into(),
                    minimum_access: (*runtime_access).max(capability.minimum_access),
                });
            }
        }
        graph.validate()?;
        Ok(graph)
    }

    pub fn validate(&self) -> Result<(), ValidationError> {
        unique("node", self.nodes.iter().map(|node| node.id.as_str()))?;
        let ids: BTreeSet<&str> = self.nodes.iter().map(|node| node.id.as_str()).collect();
        for node in &self.nodes {
            require_identifier("node.id", &node.id)?;
            require_nonempty("node.label", &node.label)?;
        }
        for edge in &self.edges {
            if !ids.contains(edge.from.as_str()) {
                return Err(ValidationError::DanglingEdge(edge.from.clone()));
            }
            if !ids.contains(edge.to.as_str()) {
                return Err(ValidationError::DanglingEdge(edge.to.clone()));
            }
            require_identifier("edge.relationship", &edge.relationship)?;
        }
        Ok(())
    }

    pub fn project_for(&mut self, access: AccessLevel) {
        self.nodes
            .retain(|node| access.permits(node.minimum_access));
        let ids: BTreeSet<String> = self.nodes.iter().map(|node| node.id.clone()).collect();
        self.edges.retain(|edge| {
            access.permits(edge.minimum_access)
                && ids.contains(&edge.from)
                && ids.contains(&edge.to)
        });
    }
}

fn require_nonempty(field: &'static str, value: &str) -> Result<(), ValidationError> {
    if value.trim().is_empty() {
        Err(ValidationError::Empty(field))
    } else {
        Ok(())
    }
}

fn require_identifier(field: &'static str, value: &str) -> Result<(), ValidationError> {
    require_nonempty(field, value)?;
    if value.chars().all(|character| {
        character.is_ascii_alphanumeric() || matches!(character, '-' | '_' | '.' | ':' | '/')
    }) {
        Ok(())
    } else {
        Err(ValidationError::InvalidValue {
            field,
            value: value.to_string(),
        })
    }
}

fn require_sha256(field: &'static str, value: &str) -> Result<(), ValidationError> {
    let Some(digest) = value.strip_prefix("sha256:") else {
        return Err(ValidationError::InvalidValue {
            field,
            value: value.into(),
        });
    };
    if digest.len() == 64
        && digest
            .bytes()
            .all(|byte| byte.is_ascii_digit() || (b'a'..=b'f').contains(&byte))
    {
        Ok(())
    } else {
        Err(ValidationError::InvalidValue {
            field,
            value: value.into(),
        })
    }
}

fn parse_timestamp(
    field: &'static str,
    value: Option<&str>,
) -> Result<OffsetDateTime, ValidationError> {
    let value = value.ok_or(ValidationError::Empty(field))?;
    OffsetDateTime::parse(value, &Rfc3339).map_err(|_| ValidationError::InvalidValue {
        field,
        value: value.into(),
    })
}

fn unique<'a>(
    kind: &'static str,
    values: impl Iterator<Item = &'a str>,
) -> Result<(), ValidationError> {
    let mut seen = BTreeSet::new();
    for value in values {
        if !seen.insert(value) {
            return Err(ValidationError::Duplicate {
                kind,
                value: value.to_string(),
            });
        }
    }
    Ok(())
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ValidationError {
    Empty(&'static str),
    InvalidValue { field: &'static str, value: String },
    Duplicate { kind: &'static str, value: String },
    DanglingEdge(String),
    UnsupportedSchema(String),
    IncompatibleTypeShape,
    IncompatibleProvenance,
    InvalidFreshnessWindow,
}

impl fmt::Display for ValidationError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Empty(field) => write!(formatter, "{field} must not be empty"),
            Self::InvalidValue { field, value } => {
                write!(formatter, "{field} has invalid value {value:?}")
            }
            Self::Duplicate { kind, value } => {
                write!(formatter, "duplicate {kind} identifier {value:?}")
            }
            Self::DanglingEdge(id) => write!(formatter, "edge references missing node {id:?}"),
            Self::UnsupportedSchema(version) => {
                write!(formatter, "unsupported schema version {version:?}")
            }
            Self::IncompatibleTypeShape => {
                write!(formatter, "fields and variants do not match type kind")
            }
            Self::IncompatibleProvenance => {
                write!(
                    formatter,
                    "descriptor body and provenance kind are incompatible"
                )
            }
            Self::InvalidFreshnessWindow => {
                write!(
                    formatter,
                    "observation expiry must be later than observation time"
                )
            }
        }
    }
}

impl std::error::Error for ValidationError {}

#[derive(Debug)]
pub enum CanonicalError {
    Validation(ValidationError),
    Serialization(serde_json::Error),
    Utf8(std::string::FromUtf8Error),
}

impl fmt::Display for CanonicalError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Validation(error) => error.fmt(formatter),
            Self::Serialization(error) => error.fmt(formatter),
            Self::Utf8(error) => error.fmt(formatter),
        }
    }
}

impl std::error::Error for CanonicalError {}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CompatibilityError {
    Protocol { expected: String, actual: String },
    SubjectSchema { expected: String, actual: String },
}

impl fmt::Display for CompatibilityError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Protocol { expected, actual } => {
                write!(
                    formatter,
                    "protocol mismatch: expected {expected:?}, got {actual:?}"
                )
            }
            Self::SubjectSchema { expected, actual } => write!(
                formatter,
                "subject schema mismatch: expected {expected:?}, got {actual:?}"
            ),
        }
    }
}

impl std::error::Error for CompatibilityError {}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum FreshnessError {
    Validation(ValidationError),
    NotYetValid,
    Expired,
}

impl fmt::Display for FreshnessError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Validation(error) => error.fmt(formatter),
            Self::NotYetValid => write!(formatter, "observation time is in the future"),
            Self::Expired => write!(formatter, "observation has expired"),
        }
    }
}

impl std::error::Error for FreshnessError {}

#[derive(Debug)]
pub enum AuthenticationError {
    Validation(ValidationError),
    Canonical(CanonicalError),
    UnexpectedKey { expected: String, actual: String },
    MalformedSignature,
    InvalidSignature,
}

impl fmt::Display for AuthenticationError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Validation(error) => error.fmt(formatter),
            Self::Canonical(error) => error.fmt(formatter),
            Self::UnexpectedKey { expected, actual } => {
                write!(
                    formatter,
                    "unexpected signing key: expected {expected:?}, got {actual:?}"
                )
            }
            Self::MalformedSignature => write!(formatter, "signature encoding is malformed"),
            Self::InvalidSignature => write!(formatter, "signature verification failed"),
        }
    }
}

impl std::error::Error for AuthenticationError {}

#[cfg(test)]
mod tests {
    use super::*;

    fn provenance() -> Provenance {
        Provenance {
            kind: ProjectionKind::Declared,
            authority: "test-suite".into(),
            source: "fixture:type".into(),
            source_hash: "sha256:d9b22a571790401b5127bdc5a63e49d91bde8e9b468b5c888ec6823a3415d124"
                .into(),
            observed_at: None,
            expires_at: None,
        }
    }

    fn descriptor() -> DescriptorEnvelope {
        DescriptorEnvelope::new(
            "rust:type:Account",
            "account-1",
            provenance(),
            AccessLevel::Public,
            DescriptorBody::Type(TypeDescriptor {
                name: "Account".into(),
                kind: TypeKind::Struct,
                layout: Some(LayoutDescriptor {
                    size_bytes: 32,
                    align_bytes: 8,
                }),
                fields: vec![
                    FieldDescriptor {
                        name: "id".into(),
                        type_name: "u64".into(),
                        optional: false,
                        offset_bytes: Some(0),
                        minimum_access: AccessLevel::Public,
                        attributes: BTreeMap::new(),
                    },
                    FieldDescriptor {
                        name: "secret".into(),
                        type_name: "String".into(),
                        optional: false,
                        offset_bytes: None,
                        minimum_access: AccessLevel::Owner,
                        attributes: BTreeMap::new(),
                    },
                ],
                variants: vec![],
            }),
        )
        .unwrap()
    }

    #[test]
    fn canonical_hash_is_stable() {
        let first = descriptor().canonical_hash().unwrap();
        let second = descriptor().canonical_hash().unwrap();
        assert_eq!(first, second);
        assert_eq!(first.len(), "sha256:".len() + 64);
    }

    #[test]
    fn access_projection_removes_restricted_fields() {
        let public = descriptor().project_for(AccessLevel::Public).unwrap();
        let DescriptorBody::Type(value) = public.body else {
            panic!("expected a type descriptor");
        };
        assert_eq!(value.fields.len(), 1);
        assert_eq!(value.fields[0].name, "id");
    }

    #[test]
    fn access_projection_removes_restricted_variant_fields() {
        let mut value = descriptor();
        value.body = DescriptorBody::Type(TypeDescriptor {
            name: "Event".into(),
            kind: TypeKind::Enum,
            layout: None,
            fields: vec![],
            variants: vec![VariantDescriptor {
                name: "Created".into(),
                fields: vec![FieldDescriptor {
                    name: "owner_token".into(),
                    type_name: "String".into(),
                    optional: false,
                    offset_bytes: None,
                    minimum_access: AccessLevel::Owner,
                    attributes: BTreeMap::new(),
                }],
            }],
        });
        let public = value.project_for(AccessLevel::Public).unwrap();
        let DescriptorBody::Type(value) = public.body else {
            panic!("expected a type descriptor");
        };
        assert!(value.variants[0].fields.is_empty());
    }

    #[test]
    fn graph_rejects_dangling_edges() {
        let graph = OperationalSemanticGraph {
            nodes: vec![OperationalNode {
                id: "runtime:text".into(),
                label: "Text Runtime".into(),
                kind: OperationalNodeKind::Runtime,
                minimum_access: AccessLevel::Public,
            }],
            edges: vec![OperationalEdge {
                from: "runtime:text".into(),
                to: "provider:missing".into(),
                relationship: "depends-on".into(),
                minimum_access: AccessLevel::Member,
            }],
        };
        assert_eq!(
            graph.validate(),
            Err(ValidationError::DanglingEdge("provider:missing".into()))
        );
    }

    #[test]
    fn observed_provenance_requires_time_and_canonical_hash_shape() {
        let mut value = descriptor();
        value.provenance.kind = ProjectionKind::Observed;
        assert_eq!(
            value.validate(),
            Err(ValidationError::Empty("provenance.observed_at"))
        );
        value.provenance.observed_at = Some("2026-08-25T00:00:00Z".into());
        value.provenance.source_hash = "sha256:not-a-digest".into();
        assert!(matches!(
            value.validate(),
            Err(ValidationError::InvalidValue {
                field: "provenance.source_hash",
                ..
            })
        ));
    }

    #[test]
    fn observation_requires_a_bounded_freshness_window() {
        let mut value = descriptor();
        value.provenance.kind = ProjectionKind::Observed;
        value.provenance.observed_at = Some("2026-08-25T10:00:00Z".into());
        value.provenance.expires_at = Some("2026-08-25T10:05:00Z".into());
        value.body = DescriptorBody::Observation(ObservationDescriptor {
            target_id: "runtime:comic-ocr".into(),
            status: ObservationStatus::Synchronized,
            facts: BTreeMap::new(),
            differences: vec![],
        });
        value.validate().unwrap();
        value
            .require_fresh_at(OffsetDateTime::parse("2026-08-25T10:04:59Z", &Rfc3339).unwrap())
            .unwrap();
        assert_eq!(
            value.require_fresh_at(
                OffsetDateTime::parse("2026-08-25T10:05:00Z", &Rfc3339).unwrap(),
            ),
            Err(FreshnessError::Expired)
        );
        assert_eq!(
            value.require_fresh_at(
                OffsetDateTime::parse("2026-08-25T09:59:59Z", &Rfc3339).unwrap(),
            ),
            Err(FreshnessError::NotYetValid)
        );

        value.provenance.expires_at = Some("2026-08-25T09:59:59Z".into());
        assert_eq!(
            value.validate(),
            Err(ValidationError::InvalidFreshnessWindow)
        );
    }

    #[test]
    fn authenticated_envelope_rejects_tampering_and_key_substitution() {
        let signing_key = SigningKey::from_bytes(&[7_u8; 32]);
        let mut authenticated = descriptor()
            .sign("compiler-key:2026-08", &signing_key)
            .unwrap();
        authenticated
            .verify("compiler-key:2026-08", &signing_key.verifying_key())
            .unwrap();
        assert!(matches!(
            authenticated.verify("compiler-key:other", &signing_key.verifying_key()),
            Err(AuthenticationError::UnexpectedKey { .. })
        ));

        authenticated.envelope.subject_id = "rust:type:Tampered".into();
        assert!(matches!(
            authenticated.verify("compiler-key:2026-08", &signing_key.verifying_key()),
            Err(AuthenticationError::InvalidSignature)
        ));
    }

    #[test]
    fn compatibility_checks_protocol_and_subject_schema() {
        let first = descriptor();
        let mut second = descriptor();
        first.require_compatible(&second).unwrap();
        second.compatibility.subject_schema = "account-2".into();
        assert!(matches!(
            first.require_compatible(&second),
            Err(CompatibilityError::SubjectSchema { .. })
        ));
    }

    #[test]
    fn runtime_manifests_derive_operational_topology() {
        let graph = OperationalSemanticGraph::from_runtime_descriptors(&[(
            RuntimeDescriptor {
                name: "vision-runtime".into(),
                version: "1".into(),
                authority_class: "generation".into(),
                capabilities: vec![CapabilityDescriptor {
                    id: "extract-text".into(),
                    description: "Extract structured text".into(),
                    endpoint: "/v1/extract-text".into(),
                    inputs: vec![Modality::Image],
                    outputs: vec![Modality::StructuredData],
                    streaming: false,
                    minimum_access: AccessLevel::Member,
                }],
            },
            AccessLevel::Public,
        )])
        .unwrap();
        assert_eq!(graph.nodes.len(), 2);
        assert_eq!(graph.edges[0].relationship, "offers");
        let mut public = graph.clone();
        public.project_for(AccessLevel::Public);
        assert_eq!(public.nodes.len(), 1);
        assert!(public.edges.is_empty());
    }
}
