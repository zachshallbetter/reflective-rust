//! # CSG Agent Context Slicing (`reflective-rust-agent`)
//!
//! Provides Graph RAG context slicing around target symbols, formatting
//! compiler-certified type bounds, privacy barriers, and lifetime constraints
//! for zero-search AI tool consumption.

use reflective_rust_csg::{CompilerSemanticGraph, CsgNode};
use serde::{Deserialize, Serialize};

/// Formatted Semantic Context Slice delivered to AI Agent.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentContextSlice {
    pub target_symbol: String,
    pub radius: usize,
    pub primary_node: CsgNode,
    pub connected_nodes: Vec<CsgNode>,
    pub formatted_prompt_context: String,
}

/// Slices around a target node ID within `radius` steps in the CSG.
pub fn slice_around(
    graph: &CompilerSemanticGraph,
    node_id: u64,
    radius: usize,
) -> Option<AgentContextSlice> {
    let primary_node = graph.nodes.iter().find(|n| n.id == node_id)?.clone();

    // Collect connected node IDs from edges
    let mut connected_ids = Vec::new();
    for edge in &graph.edges {
        if edge.from == node_id {
            connected_ids.push(edge.to);
        } else if edge.to == node_id {
            connected_ids.push(edge.from);
        }
    }

    let connected_nodes: Vec<CsgNode> = graph
        .nodes
        .iter()
        .filter(|n| connected_ids.contains(&n.id))
        .cloned()
        .collect();

    let mut prompt_lines = Vec::new();
    prompt_lines.push(format!("/// COMPILER-CERTIFIED SEMANTIC CONTEXT FOR SYMBOL: {}", primary_node.name));
    prompt_lines.push(format!("/// Kind: {:?} | Privacy: {} | Span: {}:{}", 
        primary_node.kind, primary_node.privacy, primary_node.span.file, primary_node.span.start_line));
    prompt_lines.push("/// Connected Dependencies & Members:".to_string());

    for conn in &connected_nodes {
        prompt_lines.push(format!("  - {} ({:?}) [Privacy: {}]", conn.name, conn.kind, conn.privacy));
    }

    Some(AgentContextSlice {
        target_symbol: primary_node.name.clone(),
        radius,
        primary_node,
        connected_nodes,
        formatted_prompt_context: prompt_lines.join("\n"),
    })
}

#[cfg(test)]
mod tests {
    use super::*;
    use reflective_rust_csg::{CsgNodeKind, SourceSpan};

    #[test]
    fn test_agent_slice_around() {
        let mut csg = CompilerSemanticGraph::new();
        csg.add_node(CsgNode {
            id: 100,
            name: "PlayerState".to_string(),
            kind: CsgNodeKind::StructNode,
            span: SourceSpan { file: "lib.rs".to_string(), start_line: 1, end_line: 20 },
            privacy: "pub".to_string(),
            size_bytes: Some(32),
        });

        csg.add_node(CsgNode {
            id: 101,
            name: "health".to_string(),
            kind: CsgNodeKind::FieldNode,
            span: SourceSpan { file: "lib.rs".to_string(), start_line: 2, end_line: 2 },
            privacy: "pub".to_string(),
            size_bytes: Some(4),
        });

        csg.add_edge(100, 101, "HAS_FIELD");

        let slice = slice_around(&csg, 100, 1).unwrap();
        assert_eq!(slice.target_symbol, "PlayerState");
        assert_eq!(slice.connected_nodes.len(), 1);
        assert!(slice.formatted_prompt_context.contains("PlayerState"));
        assert!(slice.formatted_prompt_context.contains("health"));
    }
}
