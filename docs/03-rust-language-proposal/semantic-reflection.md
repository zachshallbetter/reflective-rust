---
title: "Static Semantic Reflection Specification (`core::meta`)"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Static Semantic Reflection Specification (`core::meta`) under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Static Semantic Reflection Specification (`core::meta`)

> **Status:** Canonical Language RFC Specification  
> **Reference Substrate:** [`crates/reflective-rust-meta`](../../crates/reflective-rust-meta)  

---

## 1. Syntax & Core Type Definitions

This specification proposes adding the module `core::meta` to the Rust Standard Library (`#![no_std]` compatible), providing static compile-time reflection via opaque compiler-synthesized handles (`Info`).

```rust
pub namespace core::meta {
    /// Opaque, non-forgeable handle representing a compiler semantic entity.
    #[derive(Copy, Clone, PartialEq, Eq, Hash)]
    pub struct Info {
        id: u64,
        kind: Kind,
    }

    /// Primary static reflection query intrinsic.
    pub const fn of<T: ?Sized>() -> Info;

    /// Memory layout attributes intrinsic.
    pub const fn layout_of<T: ?Sized>() -> LayoutInfo;

    /// Field introspection query.
    pub const fn fields_of(info: Info) -> &'static [FieldInfo];

    /// Enum variant introspection query.
    pub const fn variants_of(info: Info) -> &'static [VariantInfo];
}
```

---

## 2. Compile-Time Evaluation Guarantees (`consteval`)

1. **Zero Runtime Overhead**: `core::meta::Info` handles operate exclusively during `consteval`. Un-annotated types generate **0 bytes** of static binary or heap allocation overhead.
2. **Deterministic Monomorphization**: Reflection queries evaluated within `const fn` produce compile-time constants that are folded during optimization phases (`LLVM / Cranelift`).
3. **Safety & Privacy Boundaries**: Reflection queries respect item visibility (`pub`, `pub(crate)`, `private`). Private struct fields remain inaccessible to reflection queries outside their defining module unless explicit capabilities are granted.
---

## Navigation
[← 03 Rust Language Proposal](../03-rust-language-proposal/README.md) | [Table of Contents](../SUMMARY.md) | [Compile-Time Execution →](../03-rust-language-proposal/compile-time-execution.md)
