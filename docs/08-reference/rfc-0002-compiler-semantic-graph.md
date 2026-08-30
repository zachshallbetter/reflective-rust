---
title: "RFC 0002: Compiler Semantic Graph (CSG) Specification"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for RFC 0002: Compiler Semantic Graph (CSG) Specification under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# RFC 0002: Compiler Semantic Graph (CSG) Specification

- Feature Name: `compiler_semantic_graph`
- Start Date: 2026-07-31
- Proposal status: repository research draft; no compiler extractor implemented

---

## 1. Summary

This RFC proposes the **Compiler Semantic Graph (CSG)**: a standardized, language-agnostic out-of-process semantic representation that exposes compiler-resolved program entities (AST nodes, resolved types, trait bounds, lifetime constraints, hygiene maps, and source spans) across multiple compiler backends (LLVM, Cranelift, GCC).

---

## 2. Motivation

Internal representations in `rustc` (`HIR`, `MIR`, `TyCtxt`) are internal compiler details that change frequently. External toolchains, language servers (rust-analyzer), IDEs, AI coding agents, and spatial environments must currently re-parse and approximate semantic analysis. 

The CSG establishes a stable, versioned, out-of-process graph protocol (`reflective-rust-csg`).

---

## 3. Reference-Level Explanation

```json
{
  "schema_version": "rr-csg-0.1",
  "provenance": {
    "kind": "fixture",
    "source": "example"
  },
  "nodes": [
    {
      "id": "type:PlayerState",
      "name": "PlayerState",
      "kind": "struct",
      "span": { "file": "src/lib.rs", "start_line": 1, "end_line": 20 },
      "minimum_access": "public",
      "size_bytes": 32
    },
    {
      "id": "field:PlayerState:health",
      "name": "health",
      "kind": "field",
      "span": { "file": "src/lib.rs", "start_line": 2, "end_line": 2 },
      "minimum_access": "public",
      "size_bytes": 4
    }
  ],
  "edges": [
    { "from": "type:PlayerState", "to": "field:PlayerState:health", "relationship": "contains", "minimum_access": "public" }
  ]
}
```

- **Query Schema**: Out-of-process toolchains communicate with `rustc` via JSON-RPC / gRPC.
- **Cross-Backend Determinism**: future compiler extractors must emit conformance vectors. Current CI validates the exchange model only.
---

## Navigation
[← RFC 0001: Static Semantic Reflection](../08-reference/rfc-0001-semantic-static-reflection.md) | [Table of Contents](../SUMMARY.md) | [RFC 0003: Opt-In Zero-Cost Runtime Descriptors →](../08-reference/rfc-0003-runtime-descriptors.md)
