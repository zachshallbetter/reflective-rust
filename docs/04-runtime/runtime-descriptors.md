---
title: "Runtime Descriptors"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Runtime Descriptors under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Runtime Descriptors

**Status:** Research synthesis

## 15. Runtime projection model

### 15.1 Principle

`meta::Info` never survives into ordinary runtime memory. A compiler or metaprogram emits only the requested projection.

### 15.2 Descriptor model

```rust
pub mod reflect_runtime {
    #[repr(transparent)]
    #[derive(Clone, Copy, Eq, PartialEq, Hash)]
    pub struct TypeKey([u8; 16]);

    pub struct TypeInfo {
        pub key: TypeKey,
        pub name: &'static str,
        pub kind: TypeKind,
        pub size: Option<usize>,
        pub align: Option<usize>,
        pub fields: &'static [FieldInfo],
        pub methods: &'static [MethodInfo],
        pub constructors: &'static [ConstructorInfo],
        pub capabilities: TypeCapabilities,
        pub schema_version: Option<u64>,
    }

    pub struct FieldInfo {
        pub name: &'static str,
        pub ty: fn() -> &'static TypeInfo,
        pub capabilities: FieldCapabilities,
        pub shared_get: Option<SharedGetter>,
        pub mutable_get: Option<MutableGetter>,
        pub set_owned: Option<OwnedSetter>,
        pub attributes: &'static [RuntimeAttribute],
    }

    pub struct MethodInfo {
        pub name: &'static str,
        pub receiver: ReceiverKind,
        pub parameters: &'static [ParameterInfo],
        pub return_type: fn() -> &'static TypeInfo,
        pub effects: MethodEffects,
        pub capabilities: MethodCapabilities,
        pub invoke: InvokeAdapter,
    }
}
```

### 15.3 Runtime identity classes

| Key class | Stability | Use |
|---|---|---|
| Process-local | one execution | fast registry lookup |
| Build-local | one linked artifact | descriptor deduplication |
| Schema key | across explicitly compatible releases | persistence and RPC negotiation |
| Human name | no uniqueness guarantee | display and diagnostics |

Names, compiler IDs, addresses, and schema IDs must not be conflated.
---

## Navigation
[← Runtime Reflection](../04-runtime/runtime-reflection.md) | [Table of Contents](../SUMMARY.md) | [Invocation Adapters →](../04-runtime/invocation.md)
