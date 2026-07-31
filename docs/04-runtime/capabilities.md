---
title: "Capability-Based Access"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Capability-Based Access under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Capability-Based Access

**Status:** Research synthesis

## 17. Capability-based runtime access

Discoverability is not authority.

```rust
bitflags! {
    pub struct TypeCapabilities: u32 {
        const DISCOVER  = 1 << 0;
        const CONSTRUCT = 1 << 1;
        const CLONE     = 1 << 2;
        const SERIALIZE = 1 << 3;
        const OBSERVE   = 1 << 4;
    }

    pub struct FieldCapabilities: u32 {
        const READ_SHARED     = 1 << 0;
        const WRITE_EXCLUSIVE = 1 << 1;
        const SET_OWNED       = 1 << 2;
        const OBSERVE         = 1 << 3;
    }

    pub struct MethodCapabilities: u32 {
        const INVOKE = 1 << 0;
        const RPC    = 1 << 1;
        const EDITOR = 1 << 2;
    }
}
```

A downstream crate cannot grant itself access to a private field. The compiler emits private accessors only inside an authenticated owner context, and the owner explicitly chooses what to export.

```rust
#[reflect_runtime(
    type(discover, construct),
    fields(public = "read", marked = "read,write"),
    methods(marked = "invoke")
)]
pub struct Light {
    #[reflect(editor, range = 0.0..=100_000.0)]
    intensity: f32,

    #[reflect(editor)]
    color: Color,

    cache: InternalCache,
}
```

`cache` is absent from the public projection.
---

## Navigation
[← Privacy Boundaries](../04-runtime/privacy.md) | [Table of Contents](../SUMMARY.md) | [Serialization →](../04-runtime/serialization.md)
