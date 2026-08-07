//! Example 03: Compiler Semantic Graph (CSG) Substrate & JSON Out-of-Process Query
//! Run with: `cargo run --example csg_query -p reflective-rust-csg`

use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, CsgNodeKind, SourceSpan};

fn main() {
    println!("=== Reflective Rust Example 03: Compiler Semantic Graph (CSG) ===");

    let mut csg = CompilerSemanticGraph::new();

    // Add Struct Node
    csg.add_node(CsgNode {
        id: 1000,
        name: "WorldState".to_string(),
        kind: CsgNodeKind::StructNode,
        span: SourceSpan {
            file: "src/world.rs".to_string(),
            start_line: 5,
            end_line: 30,
        },
        privacy: "pub".to_string(),
        size_bytes: Some(64),
    });

    // Add Field Nodes
    csg.add_node(CsgNode {
        id: 1001,
        name: "tick_count".to_string(),
        kind: CsgNodeKind::FieldNode,
        span: SourceSpan {
            file: "src/world.rs".to_string(),
            start_line: 6,
            end_line: 6,
        },
        privacy: "pub".to_string(),
        size_bytes: Some(8),
    });

    csg.add_edge(1000, 1001, "HAS_FIELD");

    // Serialize out-of-process JSON
    let json = csg.to_json().expect("Failed to serialize CSG graph");
    println!("Out-of-Process JSON-RPC Graph Output:\n{}", json);

    assert!(csg.verify_conformance());
    println!("\n[OK] CSG Graph Out-of-Process Serialization Succeeded!");
}
