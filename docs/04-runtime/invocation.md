---
title: "Dynamic Invocation"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Dynamic Invocation under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Dynamic Invocation

**Status:** Research synthesis

## 16. Safe erased values and invocation

### 16.1 Sealed erased references

Safe runtime reflection must not accept arbitrary raw pointers paired with claimed type IDs.

```rust
pub struct DynRef<'a> {
    ptr: core::ptr::NonNull<()>,
    ty: TypeKey,
    provenance: ProvenanceToken<'a>,
}

pub struct DynMut<'a> {
    ptr: core::ptr::NonNull<()>,
    ty: TypeKey,
    provenance: ExclusiveToken<'a>,
}

pub struct OwnedValue {
    storage: OwnedStorage,
    ty: TypeKey,
    drop_fn: unsafe fn(*mut ()),
}
```

Fields are private. Only generated projection code and audited runtime internals can construct these values. `DynMut` is non-cloneable and represents exclusive authority.

### 16.2 Adapter strategies

| Adapter | Borrowed values | Cost | Complexity | Recommended use |
|---|---:|---:|---:|---|
| Owned value vector | copied/owned only | allocation and conversion | low | MVP, RPC, scripting |
| Borrow-aware call frame | supported relationships | low-moderate | high | editors, in-process reflection |
| Typed method handle | fully static after lookup | near direct call | medium | repeated performance-sensitive calls |

### 16.3 Safe facade sequence

```text
lookup method
-> verify invoke capability
-> verify receiver kind and TypeKey
-> verify shared/exclusive authority
-> verify argument count and TypeKeys
-> verify supported ownership/lifetime mode
-> call generated thunk
-> wrap return with generated provenance
```

Unsupported borrowed signatures, higher-ranked relationships, variadics, unsafe preconditions, or unsized values are rejected unless the runtime ABI explicitly supports them.
---

## Navigation
[← Runtime Descriptors](../04-runtime/runtime-descriptors.md) | [Table of Contents](../SUMMARY.md) | [Registries →](../04-runtime/registries.md)
