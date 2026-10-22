---
title: "Graph RAG Context Slicing Proposal (`csg::slice_around`)"
scope: "long-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Research proposal for graph-based context slicing; compiler-certified extraction is not implemented."
---
# Proposed Graph-Based Context Slicing (`csg::slice_around`)

> **Status:** Research proposal; compiler extraction is not implemented  
> **Reference Substrate:** [`crates/reflective-rust-agent`](../../crates/reflective-rust-agent)  

---

## 1. Context Blindness in LLM Coding Assistants

Traditional AI coding assistants process source code as unstructured text files or simple regex chunks. This approach suffers from critical failure modes:
1. **Hallucination of Private Fields**: Agents suggest accessing private struct fields outside their visibility module.
2. **Context Window Flooding**: Including full source files wastes thousands of LLM tokens on irrelevant boilerplate.
3. **Broken Trait Invariants**: Agents misinterpret trait implementation requirements due to missing trait context.

---

## 2. Compiler-Certified Graph RAG Slicing

**Reflective Rust** proposes graph-based context slicing (`csg::slice_around`) to provide more structured context. The current workspace can slice supplied graph data, but has no compiler extractor; fixture data is not compiler-certified evidence.

```rust
use reflective_rust_agent::slice_around;

// Illustrative pseudocode: slice a supplied graph fixture around symbol #1
let slice = slice_around(&csg_graph, target_symbol_id, 1).unwrap();
println!("{}", slice.formatted_prompt_context);
```

### 2.1 Slicing Protocol Output Example

```text
/// ILLUSTRATIVE FIXTURE CONTEXT FOR SYMBOL: SecurityToken
/// Kind: StructNode | Privacy: pub | Span: auth.rs:1
/// Connected Dependencies & Members:
  - secret_key (FieldNode) [Privacy: pub(crate)]
```

This does not guarantee compiler verification or eliminate hallucinations. Such guarantees would require a real compiler extractor, sound provenance enforcement, and independent validation; those integrations are future work.
---

## Navigation
[← SSP Spatial Anchor Protocol](../09-research/ssp-spatial-anchor-protocol.md) | [Table of Contents](../SUMMARY.md) | [Performance Metrics & Empirical Proof →](../09-research/performance-and-empirical-proof.md)
