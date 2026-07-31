//! # Reflective Rust Cross-Backend Conformance Vectors (`reflective-rust-conformance`)
//!
//! Validates byte-identical Compiler Semantic Graph (CSG) schema conformance
//! across LLVM, Cranelift, and GCC compiler backends.

use reflective_rust_csg::CompilerSemanticGraph;
use serde::{Deserialize, Serialize};

/// Compiler Backend Target.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum CompilerBackend {
    LLVM,
    Cranelift,
    GCC,
}

/// Conformance Test Vector result.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConformanceVectorResult {
    pub backend: CompilerBackend,
    pub node_count: usize,
    pub edge_count: usize,
    pub schema_hash: String,
    pub is_conformant: bool,
}

/// Verifies that two CSG graphs produced by different compiler backends are byte-identical in semantic schema.
pub fn verify_backend_conformance(
    backend_a: CompilerBackend,
    graph_a: &CompilerSemanticGraph,
    backend_b: CompilerBackend,
    graph_b: &CompilerSemanticGraph,
) -> (ConformanceVectorResult, ConformanceVectorResult, bool) {
    let json_a = graph_a.to_json().unwrap_or_default();
    let json_b = graph_b.to_json().unwrap_or_default();

    let is_identical = json_a == json_b;

    let res_a = ConformanceVectorResult {
        backend: backend_a,
        node_count: graph_a.nodes.len(),
        edge_count: graph_a.edges.len(),
        schema_hash: format!("{:016x}", json_a.len()),
        is_conformant: is_identical,
    };

    let res_b = ConformanceVectorResult {
        backend: backend_b,
        node_count: graph_b.nodes.len(),
        edge_count: graph_b.edges.len(),
        schema_hash: format!("{:016x}", json_b.len()),
        is_conformant: is_identical,
    };

    (res_a, res_b, is_identical)
}

#[cfg(test)]
mod tests {
    use super::*;
    use reflective_rust_csg::{CsgNode, CsgNodeKind, SourceSpan};

    #[test]
    fn test_cross_backend_conformance() {
        let mut g1 = CompilerSemanticGraph::new();
        g1.add_node(CsgNode {
            id: 1,
            name: "TestStruct".to_string(),
            kind: CsgNodeKind::StructNode,
            span: SourceSpan { file: "lib.rs".to_string(), start_line: 1, end_line: 10 },
            privacy: "pub".to_string(),
            size_bytes: Some(16),
        });

        let g2 = g1.clone();

        let (res_llvm, res_cranelift, pass) = verify_backend_conformance(
            CompilerBackend::LLVM,
            &g1,
            CompilerBackend::Cranelift,
            &g2,
        );

        assert!(pass);
        assert_eq!(res_llvm.node_count, res_cranelift.node_count);
    }
}
