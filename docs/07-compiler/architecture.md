---
title: "Compiler Integration Architecture"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compiler Integration Architecture under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Compiler Integration Architecture

**Status:** Research synthesis

## 14. Rustc integration architecture

| Compiler subsystem | Responsibility |
|---|---|
| `rustc_expand` | preserve hygiene/source provenance; materialize generated fragments |
| `rustc_resolve` | semantic identity, namespaces, access contexts |
| HIR collection | item shape, generics, signatures, declared attributes |
| body type checking | inferred local types, method resolution, coercions |
| trait solver | contextual proof, normalization, ambiguity-preserving results |
| `rustc_middle::ty` | internal identity and substitutions behind `Info` |
| CTFE interpreter | compile-time-only execution and reflection intrinsics |
| query system | incremental dependency tracking and caching |
| privacy checker | filter reflected entities and validate private projections |
| coherence checker | validate generated implementations |
| MIR construction | lower generated code and future reflectable-domain transforms |
| monomorphization collector | identify concrete reflection adapters and instances |
| metadata encoder | export only permitted semantic data across crates |
| codegen/linker | emit, deduplicate, retain, and strip runtime descriptors |
| diagnostics | retain source invocation, generator, reflected entity, and generated span |

The public API must not freeze HIR, THIR, MIR, `DefId`, `Ty<'tcx>`, solver goals, or backend `Instance` structures into the language.
---

## Navigation
[← 07 Compiler Architecture & CSG](../07-compiler/README.md) | [Table of Contents](../SUMMARY.md) | [Compiler Semantic Graph (CSG) →](../07-compiler/compiler-semantic-graph.md)
