//! Real-World Industrial Example: AI Agent Copilot Prompt Generator
//! Run with: `cargo run --example ai_agent_copilot -p reflective-rust-agent`

use reflective_rust_agent::slice_around;
use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, CsgNodeKind, SourceSpan};

fn main() {
    println!("=== Real-World Industrial Example: AI Agent Copilot Graph RAG Generator ===");

    let mut csg = CompilerSemanticGraph::new();
    csg.add_node(CsgNode {
        id: 1,
        name: "SecurityToken".to_string(),
        kind: CsgNodeKind::StructNode,
        span: SourceSpan { file: "auth.rs".to_string(), start_line: 1, end_line: 30 },
        privacy: "pub".to_string(),
        size_bytes: Some(64),
    });

    csg.add_node(CsgNode {
        id: 2,
        name: "secret_key".to_string(),
        kind: CsgNodeKind::FieldNode,
        span: SourceSpan { file: "auth.rs".to_string(), start_line: 5, end_line: 5 },
        privacy: "pub(crate)".to_string(),
        size_bytes: Some(32),
    });

    csg.add_edge(1, 2, "CONTAINS_FIELD");

    let target_symbol_id = 1;
    let radius = 1;

    let slice = slice_around(&csg, target_symbol_id, radius).expect("Graph RAG Slicing Failed");

    println!("Extracted Compiler-Certified LLM Prompt Context Slice:");
    println!("--------------------------------------------------");
    println!("{}", slice.formatted_prompt_context);
    println!("--------------------------------------------------");

    assert!(slice.formatted_prompt_context.contains("SecurityToken"));
    assert!(slice.formatted_prompt_context.contains("secret_key"));
    println!("\n[OK] Real-World AI Agent Copilot Prompt Context Slicing Succeeded!");
}
