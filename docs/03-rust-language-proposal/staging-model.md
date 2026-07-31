---
title: "Staging Model"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Staging Model under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Staging Model

**Status:** Research synthesis

## 12. Generation staging and semantic cycles

### 12.1 The cycle problem

```rust
if !meta::prove(meta::trait_ref::<T, Serialize>())? {
    meta::emit_item(/* impl Serialize for T */);
}
```

If emitted declarations are visible immediately, the output changes the query that produced it.

### 12.2 Frozen snapshot model

The initial language should use one-way materialization:

```text
A. parse and expand ordinary macros
B. resolve and type reflection inputs
C. freeze semantic snapshot S0
D. execute metaprograms against S0
E. produce typed fragments G0
F. materialize S1 = S0 + G0
G. resolve, type-check, and coherence-check S1
H. continue to MIR and code generation
```

Generated entities are not visible to their producer.

### 12.3 Fixed-point generation

Automatic fixed-point iteration is excluded from the initial design because it complicates:

- termination;
- coherence;
- diagnostic causality;
- incremental dependency graphs;
- deterministic ordering;
- semantic versioning.

Explicit later stages may be researched separately, each observing a frozen prior stage.
---

## Navigation
[← Layout and Monomorphization](../03-rust-language-proposal/layout-and-monomorphization.md) | [Table of Contents](../SUMMARY.md) | [Compile-Time Phase State Machine →](../03-rust-language-proposal/phase-state-machine.md)
