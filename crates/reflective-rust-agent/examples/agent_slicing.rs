use reflective_rust_agent::slice_around;
use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, CsgNodeKind, SourceSpan};
use reflective_rust_protocol::AccessLevel;

fn main() {
    let mut graph = CompilerSemanticGraph::fixture("example:agent-slicing");
    graph.nodes.push(CsgNode {
        id: "type:Account".into(),
        name: "Account".into(),
        kind: CsgNodeKind::Struct,
        span: SourceSpan {
            file: "account.rs".into(),
            start_line: 1,
            end_line: 4,
        },
        minimum_access: AccessLevel::Public,
        size_bytes: None,
    });
    let slice = slice_around(&graph, "type:Account", 1, AccessLevel::Public)
        .expect("graph must validate")
        .expect("target must exist");
    println!(
        "{} nodes; compiler_certified={}",
        slice.nodes.len(),
        slice.compiler_certified
    );
}
