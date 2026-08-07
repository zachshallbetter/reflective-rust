---
title: "Compile-Time Phase State Machine"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compile-Time Phase State Machine under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Compile-Time Phase State Machine

> **Status:** Canonical Language Proposal Specification  
> **Adapted from:** PDP Pipeline State Machine & Type-System Invariants  

This document specifies the phase state machine governing **`core::meta::Info`** consteval queries. By leveraging Rust's type system, illegal cross-phase queries (e.g., querying post-monomorphization layout during AST macro expansion) are rendered **unrepresentable by construction**.

---

## 1. Compiler Phase State Enum

A semantic reflection query is executed within an explicit compiler phase state:

```rust
pub enum QueryState<P: Phase> {
    AstExpansion(Context<AstPhase>),
    NameResolution(Context<ResolvePhase>),
    TypeChecking(Context<TypeCheckPhase>),
    Monomorphization(Context<MonomorphizedPhase>),
    FrozenSnapshot(Context<FrozenPhase>),
}
```

---

## 2. Unrepresentable Illegal Transitions

Queries over `Info` handles are implemented as trait methods parameterized over `P: Phase`. Access to specific query methods is granted only when the active compiler state implements the required phase marker trait:

```rust
pub trait Phase {}
pub trait SupportsLayout: Phase {}
pub trait SupportsAST: Phase {}

impl Phase for AstPhase {}
impl SupportsAST for AstPhase {}

impl Phase for MonomorphizedPhase {}
impl SupportsLayout for MonomorphizedPhase {}

impl Info {
    /// Available in any phase
    pub const fn kind(&self) -> Kind { ... }

    /// Available ONLY in phases supporting monomorphized layout
    pub const fn layout<P: SupportsLayout>(&self, cx: &Context<P>) -> Result<Layout, QueryError> {
        ...
    }
}
```

### Invariants Enforced by Type System
1. **No Pre-Typecheck Layout Access**: Calling `.layout()` during AST expansion produces a **compile-time type error** in the consteval metaprogram - not a runtime panic or non-deterministic compiler crash.
2. **Frozen Snapshot Transition**: Transition to `FrozenSnapshot` seals the CSG state; no further item generation or AST mutation is permitted once layout queries begin.
---

## Navigation
[← Staging Model](../03-rust-language-proposal/staging-model.md) | [Table of Contents](../SUMMARY.md) | [08 Reference & Scaffolding →](../08-reference/README.md)
