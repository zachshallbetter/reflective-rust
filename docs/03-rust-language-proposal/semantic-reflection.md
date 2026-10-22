---
title: "Static Semantic Reflection Specification (`core::meta`)"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Static Semantic Reflection Specification (`core::meta`) under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Static Semantic Reflection Specification (`core::meta`)

> **Status:** Canonical repository proposal text; not an upstream Rust RFC and not implemented by this workspace.  
> **Related workspace code:** [`crates/reflective-rust-meta`](../../crates/reflective-rust-meta) contains the current runtime-oriented reference implementation; it does not implement the proposed compiler-owned `core::meta::Info` API.  

---

## 1. Syntax & Core Type Definitions

This proposal describes adding the module `core::meta` to the Rust standard library (`#![no_std]` compatible), providing static compile-time reflection via opaque compiler-synthesized handles (`Info`). The API below is a design sketch, not compilable stable-Rust API. The Rust Project's separate reflection/comptime experiment is tracked independently; this repository's workspace does not implement this proposal.

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

1. **Zero Runtime Overhead Requirement**: a future `core::meta::Info` implementation must operate exclusively during `consteval` and demonstrate that unprojected types gain no static binary or heap representation overhead.
2. **Deterministic Monomorphization**: Reflection queries evaluated within `const fn` produce compile-time constants that are folded during optimization phases (`LLVM / Cranelift`).
3. **Safety & Privacy Boundaries**: Reflection queries respect item visibility (`pub`, `pub(crate)`, `private`). Private struct fields remain inaccessible to reflection queries outside their defining module unless explicit capabilities are granted.
---

## Navigation
[← 03 Rust Language Proposal](../03-rust-language-proposal/README.md) | [Table of Contents](../SUMMARY.md) | [Compile-Time Execution →](../03-rust-language-proposal/compile-time-execution.md)
