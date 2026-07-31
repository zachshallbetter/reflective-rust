---
title: "Proposed Syntax Sketch"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Proposed Syntax Sketch under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Proposed Syntax Sketch

**Status:** Research synthesis

```rust
consteval fn describe<T>() -> meta::Info {
    meta::reflect_type::<T>()
}

consteval fn emit_schema<T>() {
    let ty = meta::reflect_type::<T>();
    for field in meta::fields_of(ty) {
        let field_ty = meta::type_of(field).unwrap();
        meta::emit_item(meta::quote! {
            // typed splicing occurs at grammar-specific positions
            type __Field = meta::splice_type!(field_ty);
        });
    }
}
```

The concrete syntax remains open. The semantic requirements are firmer than the spelling:

- reflection handles are compile-time only;
- query availability is phase-constrained;
- reification is grammar-typed;
- generated code is checked as ordinary Rust;
- generation observes a frozen semantic snapshot.
---

## Navigation
[← Meta Info](../03-rust-language-proposal/meta-info.md) | [Table of Contents](../SUMMARY.md) | [Reflection Queries →](../03-rust-language-proposal/reflection-queries.md)
