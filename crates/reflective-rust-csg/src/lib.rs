//! Exchange model for compiler-produced semantic graphs.
//!
//! A graph is compiler-certified only when a named compiler extractor supplies
//! its provenance. Hand-authored data must use `GraphProvenance::Fixture`.

use reflective_rust_protocol::AccessLevel;
use serde::{Deserialize, Serialize};
use std::collections::BTreeSet;
use std::fmt;

pub const CSG_SCHEMA_VERSION: &str = "rr-csg-0.1";

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
            nodes: Vec::new(),
            edges: Vec::new(),
        }
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
}

impl fmt::Display for GraphError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Validation(error) => error.fmt(formatter),
            Self::Serialization(error) => error.fmt(formatter),
        }
    }
}

impl std::error::Error for GraphError {}

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
}
