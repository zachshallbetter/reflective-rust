---
title: "Layout and Monomorphization"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Layout and Monomorphization under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Layout and Monomorphization

**Status:** Research synthesis

## 9. Layout and monomorphization

Rust's default layout is not a stable cross-build schema. Layout reflection must be target-specific and available only for concrete, layout-known types.

```rust
pub struct Layout {
    pub size: u64,
    pub align: u64,
    pub abi: AbiClass,
    pub fields: MetaSlice<FieldLayout>,
    pub target: TargetFingerprint,
    pub representation: Representation,
}

pub struct FieldLayout {
    pub field: Info,
    pub offset: u64,
    pub size: u64,
    pub align: u64,
}

pub const fn layout_of(ty: Info) -> Query<Layout>;
pub const fn instances_of(item: Info) -> Query<MetaSlice<Info>>;
```

Persistent formats, plugin ABIs, FFI, and network protocols still require explicit representation or schema contracts.
---

## Navigation
[← Diagnostics](../03-rust-language-proposal/diagnostics.md) | [Table of Contents](../SUMMARY.md) | [Staging Model →](../03-rust-language-proposal/staging-model.md)
