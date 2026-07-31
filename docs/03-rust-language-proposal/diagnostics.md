---
title: "Diagnostics"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Diagnostics under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Diagnostics

**Status:** Research synthesis

## 21. Diagnostics

Reflection diagnostics need to preserve:

- source invocation;
- metaprogram call stack;
- reflected entity;
- query prerequisite;
- access context;
- generated fragment and virtual source span.

Examples:

```text
error[E-META-LAYOUT]: layout is not available for a polymorphic type
  --> src/schema.rs:42:18
   = reflected type: `T`
   = requirement not met: concrete substitutions and target-known `Sized`
   = help: move the query to a monomorphized projection
```

```text
error[E-META-PRIVATE]: reflected member is not accessible
  --> src/editor.rs:11:25
   = member: private field of `model::Account`
   = projection site: crate `editor_support`
   = help: define the projection in `model` or explicitly export the member
```

```text
error[E-META-CYCLE]: semantic generation depends on its own output
  --> src/derive.rs:27:1
   = query: whether `T: Encode`
   = generated output: `impl Encode for T`
   = note: generated declarations are not visible in their producing snapshot
```

```text
error[E-META-BUDGET]: compile-time metaprogram exceeded its query budget
  --> src/registry.rs:8:1
   = repeated query: `associated_items_of(core::iter::Iterator)`
```
---

## Navigation
[← Compiler Phases](../03-rust-language-proposal/compiler-phases.md) | [Table of Contents](../SUMMARY.md) | [Layout and Monomorphization →](../03-rust-language-proposal/layout-and-monomorphization.md)
