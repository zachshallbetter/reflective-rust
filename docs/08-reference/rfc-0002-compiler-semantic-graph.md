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
- RFC PR: rust-lang/rfcs#0002
- Rust Issue: rust-lang/rust#00000

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
  "nodes": [
    {
      "id": 100,
      "name": "PlayerState",
      "kind": "StructNode",
      "span": { "file": "src/lib.rs", "start_line": 1, "end_line": 20 },
      "privacy": "pub",
      "size_bytes": 32
    }
  ],
  "edges": [
    { "from": 100, "to": 101, "relationship": "HAS_FIELD" }
  ]
}
```

- **Query Schema**: Out-of-process toolchains communicate with `rustc` via JSON-RPC / gRPC.
- **Cross-Backend Determinism**: CI vectors enforce byte-identical CSG schema outputs across LLVM, Cranelift, and GCC backends.
---

## Navigation
[← RFC 0001: Static Semantic Reflection](../08-reference/rfc-0001-semantic-static-reflection.md) | [Table of Contents](../SUMMARY.md) | [RFC 0003: Opt-In Zero-Cost Runtime Descriptors →](../08-reference/rfc-0003-runtime-descriptors.md)
