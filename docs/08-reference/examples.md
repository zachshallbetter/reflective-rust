---
title: "Example Workflows"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Example Workflows under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Example Workflows

**Status:** Research synthesis

## 26. Example workflows

### 26.1 Serialization

```rust
#[reflect_runtime(serializer = "fieldwise")]
pub struct Record {
    id: u64,
    name: String,

    #[reflect(skip)]
    cache: Cache,
}
```

Compile-time flow:

```text
owner-authorized semantic query
-> field policy evaluation
-> typed field walkers
-> static serializer descriptor
-> ordinary optimization
```

The runtime path may traverse descriptors. The static path may inline generated field access.

### 26.2 Editor generation

```rust
#[reflect_runtime(editor)]
pub struct Light {
    #[reflect(label = "Intensity", unit = "lm", range = 0.0..=100_000.0)]
    intensity: f32,

    #[reflect(label = "Color")]
    color: Color,
}
```

The projection generates labels, units, range metadata, shared getters, and exclusive setters. Raw offsets are unnecessary.

### 26.3 RPC

```rust
#[reflect_runtime(rpc)]
impl InventoryService {
    #[reflect(rpc, name = "inventory.get")]
    pub async fn get(
        &self,
        request: GetRequest,
    ) -> Result<GetResponse, ServiceError> {
        // ...
    }
}
```

The metaprogram checks supported ownership, schemas, `Send`/`Sync` policy, error mapping, and visibility, then generates dispatch and serialization adapters.

### 26.4 ECS

```rust
#[component]
pub struct Transform {
    translation: Vec3,
    rotation: Quat,
}
```

`#[component]` supplies domain intent. Reflection supplies field shape, drop/clone functions, editor projection, and registration metadata. Structural shape alone does not imply component semantics.

### 26.5 CallMeMaybe-style dynamic invocation

```text
meta::of::<Player>()
-> fields_of / associated_items_of
-> owner-authorized selection
-> TypeInfo and TypeKey
-> constructor/method thunks
-> registry
-> checked runtime lookup and invocation
```

Rust's version differs by representing ownership through `OwnedValue`, private access through owner authorization, and invocation through borrow/capability checks.
---

## Navigation
[← Proposed API](../08-reference/proposed-api.md) | [Table of Contents](../SUMMARY.md) | [Cookbook →](../08-reference/cookbook.md)
