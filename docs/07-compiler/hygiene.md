---
title: "Hygiene"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Hygiene under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Hygiene

**Status:** Research synthesis

## 11. Hygiene and typed reification

### 11.1 Why raw token generation is insufficient

Raw tokens repeat parsing, weaken hygiene, delay errors, and permit accidental capture. Native semantic reflection should preserve semantic identity through typed splicing.

### 11.2 Typed splice categories

```rust
pub mod core::meta::splice {
    pub const fn ty(info: Info) -> TypeFragment;
    pub const fn expr(info: Info) -> ExprFragment;
    pub const fn path(info: Info) -> PathFragment;
    pub const fn pattern(info: Info) -> PatternFragment;
    pub const fn item(info: Info) -> ItemFragment;
    pub const fn attribute(info: Info) -> AttributeFragment;
    pub const fn impl_target(info: Info) -> ImplTargetFragment;
}
```

A type splice cannot silently become an expression. A member splice cannot bypass privacy. An item fragment is validated semantic output, not unscoped text.

### 11.3 Recommended generation interface

Use a hybrid:

- typed quotation for source-shaped generated code;
- semantic builders for mechanically generated schemas or large declaration sets.

```rust
#[compile_time_only]
const fn make_serializer(ty: meta::Info) -> meta::ItemFragment {
    let helper = meta::fresh_ident("serialize_field");

    meta::quote_item! {
        fn $helper(...) {
            // generated body
        }
    }
}
```

Spliced entities retain original semantic identity. Fresh names use compiler-generated identities. Definition-site names resolve consistently.
---

## Navigation
[← Incremental Compilation](../07-compiler/incremental-compilation.md) | [Table of Contents](../SUMMARY.md) | [Coherence →](../07-compiler/coherence.md)
