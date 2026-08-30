---
title: "Decision Matrix"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Decision Matrix under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Decision Matrix

**Status:** Research synthesis

## Appendix A. Decision matrix

| Design question | Decision |
|---|---|
| Reflection representation | one opaque compiler-owned consteval-only `meta::Info` |
| Query timing | query-specific prerequisites |
| Trait queries | contextual and ambiguity-preserving |
| Layout | target-specific and concrete-type only |
| Generation | frozen snapshot and one-way materialization |
| Reification | category-typed splicing |
| Runtime reflection | opt-in generated projection |
| Runtime descriptor envelope | one versioned RSP shape with provenance, compatibility, access, and canonical identity |
| Compiler source graph | CSG, restricted to compiler-resolved facts with compiler-extractor provenance |
| Runtime topology graph | OSG, containing capabilities, contracts, providers, stores, models, and authority relationships |
| Projection status | compiler-certified, declared, derived, or observed; never inferred |
| Invocation | safe checked facade over audited generated thunks |
| Registration | explicit portable core; optional linker aggregation |
| Private structure | owner-authorized projection only |
| Generated impls | ordinary coherence checks |
| Procedural reflection | explicit domains and certified safepoints |
| Initial procedural backend | instrumented async/coroutines |
| Strongest research backend | MIR interpreter |
| Automatic fixed point | excluded |
---

## Navigation
[← Cookbook](../08-reference/cookbook.md) | [Table of Contents](../SUMMARY.md) | [Prototype Crates →](../08-reference/prototype-crates.md)
