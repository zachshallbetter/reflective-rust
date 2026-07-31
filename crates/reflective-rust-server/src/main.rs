//! # Reflective Rust CSG & Agent HTTP Query Server (`reflective-rust-server`)
//!
//! Provides out-of-process REST/JSON query endpoints serving Compiler Semantic
//! Graphs (CSG) and Graph RAG context slices to IDEs, AI agents, and Web3D apps.

use reflective_rust_agent::slice_around;
use reflective_rust_csg::{CompilerSemanticGraph, CsgNode, CsgNodeKind, SourceSpan};
use std::io::{Read, Write};
use std::net::TcpListener;

fn build_demo_csg() -> CompilerSemanticGraph {
    let mut csg = CompilerSemanticGraph::new();
    csg.add_node(CsgNode {
        id: 100,
        name: "PlayerState".to_string(),
        kind: CsgNodeKind::StructNode,
        span: SourceSpan {
            file: "src/lib.rs".to_string(),
            start_line: 10,
            end_line: 25,
        },
        privacy: "pub".to_string(),
        size_bytes: Some(32),
    });

    csg.add_node(CsgNode {
        id: 101,
        name: "health".to_string(),
        kind: CsgNodeKind::FieldNode,
        span: SourceSpan {
            file: "src/lib.rs".to_string(),
            start_line: 11,
            end_line: 11,
        },
        privacy: "pub".to_string(),
        size_bytes: Some(4),
    });

    csg.add_edge(100, 101, "CONTAINS_FIELD");
    csg
}

fn main() {
    let address = "127.0.0.1:8080";
    let listener = match TcpListener::bind(address) {
        Ok(l) => l,
        Err(e) => {
            eprintln!("Failed to bind server to {}: {}", address, e);
            return;
        }
    };

    println!("Reflective Rust CSG Query Server listening on http://{}", address);
    let csg = build_demo_csg();

    for stream in listener.incoming() {
        if let Ok(mut stream) = stream {
            let mut buffer = [0; 1024];
            let _ = stream.read(&mut buffer);
            let request_str = String::from_utf8_lossy(&buffer);

            let (status, body) = if request_str.contains("GET /api/csg") {
                ("200 OK", csg.to_json().unwrap_or_default())
            } else if request_str.contains("GET /api/slice") {
                if let Some(slice) = slice_around(&csg, 100, 1) {
                    ("200 OK", serde_json::to_string_pretty(&slice).unwrap_or_default())
                } else {
                    ("404 NOT FOUND", "{\"error\": \"Symbol not found\"}".to_string())
                }
            } else {
                ("200 OK", "{\"status\": \"Reflective Rust Server Running\", \"endpoints\": [\"/api/csg\", \"/api/slice\"]}".to_string())
            };

            let response = format!(
                "HTTP/1.1 {}\r\nContent-Type: application/json\r\nAccess-Control-Allow-Origin: *\r\nContent-Length: {}\r\n\r\n{}",
                status,
                body.len(),
                body
            );
            let _ = stream.write_all(response.as_bytes());
        }
    }
}
