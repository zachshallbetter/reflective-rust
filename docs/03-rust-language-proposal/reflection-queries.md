---
title: "Reflection Query Families"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Reflection Query Families under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Reflection Query Families

**Status:** Research synthesis

## 8. Contextual trait solving and normalization

A global `implements<Trait>() -> bool` is semantically inadequate. Results depend on generic assumptions, solver state, opaque types, normalization, and concrete substitutions.

```rust
#[consteval_only]
pub struct TypingEnv {
    _compiler_owned: (),
}

pub enum GoalResult {
    Proven,
    Disproven,
    Ambiguous(Ambiguity),
}

pub const fn current_typing_env() -> TypingEnv;

pub const fn prove(
    predicate: Info,
    env: TypingEnv,
) -> Query<GoalResult>;

pub const fn normalize(
    ty: Info,
    env: TypingEnv,
) -> Query<Info>;

pub const fn selected_impl(
    trait_ref: Info,
    env: TypingEnv,
) -> Query<Info>;
```

For a generic function constrained by `T: Trait`, the valid result may be "proved through an obligation" rather than a concrete implementation identity. Concrete implementation identity belongs to a monomorphized query.
---

## Navigation
[← Proposed Syntax](../03-rust-language-proposal/proposed-syntax.md) | [Table of Contents](../SUMMARY.md) | [Compiler Phases →](../03-rust-language-proposal/compiler-phases.md)
