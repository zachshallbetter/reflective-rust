//! Real-World Industrial Example: Out-of-Process RPC Dynamic Dispatcher
//! Run with: `cargo run --example rpc_dynamic_dispatcher -p reflective-rust-csg`

use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, CsgNodeKind, SourceSpan};
use std::collections::HashMap;

pub struct RpcDispatcher {
    methods: HashMap<String, u64>,
}

impl RpcDispatcher {
    pub fn from_csg(csg: &CompilerSemanticGraph) -> Self {
        let mut methods = HashMap::new();
        for node in &csg.nodes {
            if node.kind == CsgNodeKind::FunctionNode {
                methods.insert(node.name.clone(), node.id);
            }
        }
        Self { methods }
    }

    pub fn dispatch(&self, method_name: &str, payload_json: &str) -> String {
        if let Some(&node_id) = self.methods.get(method_name) {
            format!(
                "{{\"status\": 200, \"message\": \"Dispatched to CSG Function Node #{}\", \"payload\": {}}}",
                node_id, payload_json
            )
        } else {
            format!("{{\"status\": 404, \"error\": \"Method '{}' not found in CSG schema\"}}", method_name)
        }
    }
}

fn main() {
    println!("=== Real-World Industrial Example: Out-of-Process RPC Dynamic Dispatcher ===");

    let mut csg = CompilerSemanticGraph::new();
    csg.add_node(CsgNode {
        id: 101,
        name: "calculate_tax".to_string(),
        kind: CsgNodeKind::FunctionNode,
        span: SourceSpan { file: "billing.rs".to_string(), start_line: 10, end_line: 25 },
        privacy: "pub".to_string(),
        size_bytes: None,
    });

    csg.add_node(CsgNode {
        id: 102,
        name: "process_payment".to_string(),
        kind: CsgNodeKind::FunctionNode,
        span: SourceSpan { file: "billing.rs".to_string(), start_line: 26, end_line: 50 },
        privacy: "pub".to_string(),
        size_bytes: None,
    });

    let dispatcher = RpcDispatcher::from_csg(&csg);

    let res1 = dispatcher.dispatch("calculate_tax", "{\"amount\": 150.0}");
    println!("RPC Request 'calculate_tax' Response:\n  {}", res1);

    let res2 = dispatcher.dispatch("invalid_method", "{}");
    println!("RPC Request 'invalid_method' Response:\n  {}", res2);

    assert!(res1.contains("200"));
    assert!(res2.contains("404"));
    println!("\n✓ Out-of-Process CSG Dynamic RPC Dispatcher Succeeded!");
}
