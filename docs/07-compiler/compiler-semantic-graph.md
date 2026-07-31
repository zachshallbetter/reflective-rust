---
title: "Compiler Semantic Graph (CSG) Specification"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compiler Semantic Graph (CSG) Specification under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Compiler Semantic Graph (CSG) Specification

> **Status:** Canonical Architecture Specification  
> **Reference Substrate:** [`crates/reflective-rust-csg`](../../crates/reflective-rust-csg)  

---

## 1. Overview & CSG Schema Architecture

The **Compiler Semantic Graph (CSG)** is an out-of-process, compiler-agnostic graph representation exported by `rustc` during compilation. It externalizes the compiler's internal High-Level Intermediate Representation (HIR) and Type Context (`TyCtxt`) into a standardized JSON graph structure consumable by IDEs, static analyzers, and AI agent engines.

```text
       Compiler Semantic Graph Architecture
                     (CSG)
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
  CsgNode         CsgEdge         SourceSpan
(Declarations)   (Relations)     (Locations)
```

---

## 2. Formal Node & Edge Definitions

### 2.1 Node Types (`CsgNodeKind`)
- `CrateNode`: Root crate declaration.
- `ModuleNode`: Module namespace.
- `StructNode` / `EnumNode` / `UnionNode`: User-defined type declarations.
- `FieldNode` / `VariantNode`: Type member declarations.
- `FunctionNode` / `MethodNode`: Function definitions.
- `TraitNode` / `ImplNode`: Trait contracts and implementation blocks.

### 2.2 Edge Relations (`CsgEdge`)
- `CONTAINS_FIELD`: Parent struct to child field relation.
- `CONTAINS_VARIANT`: Parent enum to child variant relation.
- `IMPLEMENTS_TRAIT`: Trait implementation relation.
- `CALLS_FUNCTION`: Function invocation callgraph edge.
- `DEPENDS_ON`: Cross-item dependency link.

---

## 3. Schema JSON Representation

```json
{
  "version": "1.0.0",
  "nodes": [
    {
      "id": 1,
      "name": "Player",
      "kind": "StructNode",
      "span": { "file": "src/lib.rs", "start_line": 10, "end_line": 20 },
      "privacy": "pub",
      "size_bytes": 16
    }
  ],
  "edges": [
    {
      "from": 1,
      "to": 2,
      "relation": "CONTAINS_FIELD"
    }
  ]
}
```
---

## Navigation
[← Architecture Overview](../07-compiler/architecture.md) | [Table of Contents](../SUMMARY.md) | [Dependency Tracking →](../07-compiler/dependency-tracking.md)
