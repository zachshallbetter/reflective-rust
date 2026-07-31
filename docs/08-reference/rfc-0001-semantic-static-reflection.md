---
title: "RFC 0001: Static Semantic Reflection & `core::meta`"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for RFC 0001: Static Semantic Reflection & `core::meta` under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# RFC 0001: Static Semantic Reflection & `core::meta`

- Feature Name: `semantic_static_reflection`
- Start Date: 2026-07-31
- RFC PR: rust-lang/rfcs#0001
- Rust Issue: rust-lang/rust#00000

---

## 1. Summary

This RFC proposes **Static Semantic Reflection** for Rust: a phase-staged, compiler-owned, compile-time-only handle (`core::meta::Info`) and consteval query surface that allows Rust programs to inspect compiler-resolved program entities (types, traits, fields, variants, functions, modules) during compilation. 

It introduces hygienic token reification into ordinary Rust expressions, preserving Rust's non-negotiable invariants: safety, privacy boundaries, coherence, incremental compilation, and zero runtime memory cost.

---

## 2. Motivation

Modern Rust developers rely heavily on procedural macros (`syn` / `quote`) for serialization, RPC, ECS registration, and schema generation. However, procedural syntax macros operate purely on unparsed, un-typechecked token streams. They cannot inspect compiler-resolved types, trait implementations, field layouts, or privacy boundaries.

`core::meta::Info` fills this gap by exposing compiler-resolved semantic facts directly to consteval metaprograms.

---

## 3. Guide-Level Explanation

```rust
use core::meta::{self, Info, Kind};

pub const fn describe_type<T>() -> &'static str {
    const TY_INFO: Info = meta::of::<T>();
    match meta::kind_of(TY_INFO) {
        Kind::Struct => "struct",
        Kind::Enum => "enum",
        Kind::Union => "union",
        _ => "other",
    }
}
```

The handle `Info` is:
- **Opaque**: Compiler-created, non-forgeable handle.
- **Consteval-Only**: Legal only during compile-time evaluation. `Info` values never survive into runtime memory.
- **Phase-Bounded**: Queries enforce phase marker traits (`SupportsAST`, `SupportsLayout`) to prevent illegal cross-phase queries.

---

## 4. Reference-Level Explanation

### The Core Module
```rust
pub mod core::meta {
    #[lang = "meta_info"]
    #[consteval_only]
    pub struct Info {
        _compiler_owned: (),
    }

    pub const fn of<T>() -> Info;
    pub const fn kind_of(entity: Info) -> Kind;
    pub const fn same_entity(a: Info, b: Info) -> bool;
}
```

### Privacy & Coherence
1. **Privacy Boundaries**: Reflection queries over private fields or items respect ordinary privacy accessibility rules based on the call-site module scope.
2. **Reification**: Metaprograms emit typed, hygienic Rust tokens. Reified code undergoes standard borrow, safety, and coherence checks.

---

## 5. Security & Runtime Cost Model

- **Zero Memory Cost**: `Info` handles exist only in compiler memory during `consteval`. The runtime memory overhead for un-annotated types is **0 bytes**.
- **No Unsafe Type Erasure**: Static reflection never performs unchecked dynamic type-casting; dynamic dynamic invocation requires explicit generated runtime projection adapters.

---

## 6. Implementation Plan

1. Compiler Intrinsic Landing: Land `#[lang = "meta_info"]` in `rustc_middle`.
2. Consteval Query Engine: Wire type, struct, and field metadata queries in `rustc_const_eval`.
3. Standard Library Integration: Expose `core::meta` module in `core`.
4. Conformance Test Suite: Enable cross-backend byte-identical vector tests in CI.
---

## Navigation
[← RFC Template](../08-reference/rfc-template.md) | [Table of Contents](../SUMMARY.md) | [Terminology Lanes →](../08-reference/terminology-lanes.md)
