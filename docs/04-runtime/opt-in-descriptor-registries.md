---
title: "Opt-In Runtime Descriptor Registries"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Opt-In Runtime Descriptor Registries under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Opt-In Runtime Descriptor Registries

> **Status:** Canonical Runtime Subsystem Specification  
> **Target:** Runtime Semantic Projection  

This document specifies the **Opt-In Descriptor Registry** mechanism, ensuring that reflection metadata incurs **zero runtime memory cost by default**.

---

## 1. Zero-Cost Invariant

In accordance with Rust's zero-cost abstraction principle, types that do not explicitly opt into runtime reflection pay **zero memory, binary size, or execution overhead**:

$$\text{Memory Overhead}(\text{Un-annotated Type}) = 0\text{ bytes}$$

---

## 2. Deriving Reflection Metadata

Types enable runtime projection using the procedural derive macro `#[derive(Reflectable)]` or explicit consteval registration:

```rust
#[derive(Reflectable)]
#[reflect(serialize, ecs, dynamic_invoke)]
pub struct Player {
    pub id: u64,
    pub name: String,
    pub health: f32,
}
```

---

## 3. Generated Descriptor VTables

The macro expands to a static `TypeDescriptor` handle stored in a linkme/ctor static registry section:

```rust
#[linkme::distributed_slice(RUNTIME_REFLECTION_REGISTRY)]
static PLAYER_DESCRIPTOR: TypeDescriptor = TypeDescriptor {
    name: "Player",
    type_id: ::core::any::TypeId::of::<Player>(),
    size: ::core::mem::size_of::<Player>(),
    align: ::core::mem::align_of::<Player>(),
    fields: &[
        FieldDescriptor { name: "id", offset: offset_of!(Player, id), type_name: "u64" },
        FieldDescriptor { name: "name", offset: offset_of!(Player, name), type_name: "String" },
        FieldDescriptor { name: "health", offset: offset_of!(Player, health), type_name: "f32" },
    ],
};
```

---

## 4. Primary Use Cases

1. **ECS Registration**: Automatic component registration in Bevy/Flecs without manual reflection boilerplate.
2. **Serialization & RPC**: Schema-less binary/JSON serialization and checked dynamic RPC dispatch.
3. **Inspector GUIs**: Real-time property inspection in game engines and editor UI platforms.
---

## Navigation
[← Zero-Cost Guarantees](../04-runtime/zero-cost.md) | [Table of Contents](../SUMMARY.md) | [05 Metaobjects & Protocol Design →](../05-metaobjects/README.md)
