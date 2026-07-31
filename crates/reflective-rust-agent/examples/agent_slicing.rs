//! Example 04: Graph RAG CSG Agent Context Slicer (`csg::slice_around`)
//! Run with: `cargo run --example agent_slicing -p reflective-rust-agent`

use reflective_rust_agent::slice_around;
use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, CsgNodeKind, SourceSpan};

fn main() {
    println!("=== Reflective Rust Example 04: Agent Context Slicing ===");

    let mut csg = CompilerSemanticGraph::new();

    // Primary target struct
    csg.add_node(CsgNode {
        id: 500,
        name: "SecurityToken".to_string(),
        kind: CsgNodeKind::StructNode,
        span: SourceSpan {
            file: "src/auth.rs".to_string(),
            start_line: 12,
            end_line: 45,
        },
        privacy: "pub".to_string(),
        size_bytes: Some(48),
    });

    // Associated member field
    csg.add_node(CsgNode {
        id: 501,
        name: "secret_key".to_string(),
        kind: CsgNodeKind::FieldNode,
        span: SourceSpan {
            file: "src/auth.rs".to_string(),
            start_line: 14,
            end_line: 14,
        },
        privacy: "pub(crate)".to_string(),
        size_bytes: Some(32),
    });

    csg.add_edge(500, 501, "HAS_PRIVATE_FIELD");

    // Perform Graph RAG Slicing
    let slice = slice_around(&csg, 500, 1).expect("Failed to slice target symbol");

    println!("Target Symbol    : {}", slice.target_symbol);
    println!("Connected Nodes  : {}", slice.connected_nodes.len());
    println!("\nFormatted LLM Prompt Context:\n{}", slice.formatted_prompt_context);

    assert_eq!(slice.target_symbol, "SecurityToken");
    println!("\n✓ Compiler-Certified Graph RAG Agent Context Slicing Succeeded!");
}
