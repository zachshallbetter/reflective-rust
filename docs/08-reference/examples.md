---
title: "Runnable Examples"
scope: "near-term"
status: "canonical"
version: "0.1.0"
updated: "2026-08-25"
summary: "Runnable examples for the implemented stable-Rust workspace."
---
# Runnable Examples

Examples exercise only implemented behavior.

| Example | Command | Demonstrates |
| --- | --- | --- |
| Stable layout boundary | `cargo run --example static_reflection -p reflective-rust-meta` | Size/alignment and explicit proposed compiler-reflection status |
| Runtime descriptors | `cargo run --example runtime_descriptors -p reflective-rust-derive` | Derived struct fields, optionality, and offsets |
| Descriptor registry | `cargo run --example ecs_component_engine -p reflective-rust-derive` | Application-owned registry of canonical type descriptors |
| CSG fixture serialization | `cargo run --example csg_query -p reflective-rust-csg` | Validated exchange JSON without a compiler-certification claim |
| Access-aware slicing | `cargo run --example agent_slicing -p reflective-rust-agent` | Radius-bounded CSG slice under an access level |
| Local measurements | `cargo run --example run_benchmarks -p reflective-rust-bench` | Descriptor derivation and canonical hashing durations |

The removed raw-memory serializer was unsound for arbitrary Rust types. The removed RPC and copilot examples inferred executable or compiler-certified behavior from hand-authored fixtures. Those use cases require explicit runtime capabilities or a real compiler extractor before they can be represented honestly.

---

## Navigation
[← Proposed API](../08-reference/proposed-api.md) | [Table of Contents](../SUMMARY.md) | [Cookbook →](../08-reference/cookbook.md)
