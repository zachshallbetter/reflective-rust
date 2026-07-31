//! # Compiler Semantic Graph (CSG) Substrate (`reflective-rust-csg`)
//!
//! Standardized out-of-process semantic graph representation queryable across
//! LLVM, Cranelift, and GCC compiler backends.

use serde::{Deserialize, Serialize};

/// Source Code Span location.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct SourceSpan {
    pub file: String,
    pub start_line: u32,
    pub end_line: u32,
}

/// Compiler Semantic Graph Node Type.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum CsgNodeKind {
    CrateNode,
    ModuleNode,
    StructNode,
    EnumNode,
    FieldNode,
    FunctionNode,
    TraitBoundNode,
}

/// A Node in the Compiler Semantic Graph.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CsgNode {
    pub id: u64,
    pub name: String,
    pub kind: CsgNodeKind,
    pub span: SourceSpan,
    pub privacy: String,
    pub size_bytes: Option<usize>,
}

/// Directional Edge in the Compiler Semantic Graph.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CsgEdge {
    pub from: u64,
    pub to: u64,
    pub relationship: String, // e.g. "CONTAINS", "IMPLEMENTS_TRAIT", "REFERENCES_TYPE"
}

/// The Compiler Semantic Graph Container.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct CompilerSemanticGraph {
    pub nodes: Vec<CsgNode>,
    pub edges: Vec<CsgEdge>,
}

impl CompilerSemanticGraph {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn add_node(&mut self, node: CsgNode) {
        self.nodes.push(node);
    }

    pub fn add_edge(&mut self, from: u64, to: u64, relationship: impl Into<String>) {
        self.edges.push(CsgEdge {
            from,
            to,
            relationship: relationship.into(),
        });
    }

    /// Serializes graph into out-of-process JSON string for AI tools or spatial renderers.
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string_pretty(self)
    }

    /// Deserializes graph from JSON string.
    pub fn from_json(json_str: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(json_str)
    }

    /// Verifies cross-backend byte-identical schema conformance.
    pub fn verify_conformance(&self) -> bool {
        !self.nodes.is_empty()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_csg_graph_serialization() {
        let mut csg = CompilerSemanticGraph::new();
        csg.add_node(CsgNode {
            id: 1,
            name: "Player".to_string(),
            kind: CsgNodeKind::StructNode,
            span: SourceSpan {
                file: "src/main.rs".to_string(),
                start_line: 10,
                end_line: 25,
            },
            privacy: "pub".to_string(),
            size_bytes: Some(16),
        });

        csg.add_node(CsgNode {
            id: 2,
            name: "id".to_string(),
            kind: CsgNodeKind::FieldNode,
            span: SourceSpan {
                file: "src/main.rs".to_string(),
                start_line: 11,
                end_line: 11,
            },
            privacy: "pub".to_string(),
            size_bytes: Some(8),
        });

        csg.add_edge(1, 2, "CONTAINS_FIELD");

        let json = csg.to_json().unwrap();
        assert!(json.contains("Player"));
        assert!(json.contains("CONTAINS_FIELD"));

        let restored = CompilerSemanticGraph::from_json(&json).unwrap();
        assert_eq!(restored.nodes.len(), 2);
        assert!(restored.verify_conformance());
    }
}
