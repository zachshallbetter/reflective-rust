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

This document proposes an **Opt-In Descriptor Registry** mechanism. It describes a design goal—avoiding metadata for types that do not opt in—not a verified cost guarantee. The current workspace implements opt-in runtime descriptors, but not this compiler-integrated registry architecture.

---

## 1. Proposed Cost Goal (Not Yet Established)

The intended design goal is that unannotated types incur no reflection-specific metadata overhead. This has not been established by a theorem or benchmark in this repository. Runtime, binary-size, and execution costs depend on the concrete implementation and build.

$\text{Target: minimize reflection overhead for unannotated types}$

---

## 2. Deriving Reflection Metadata

In the implemented workspace, types can opt into syntax-derived runtime descriptors using `#[derive(Reflectable)]`. The `consteval` registration API described by this proposal is not available in stable Rust:

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

## 3. Illustrative Registry Sketch (Not Current Workspace Behavior)

The following is a conceptual sketch, not a compilable example or a description of what the current derive macro generates. A concrete registry implementation would need its own design and tests:

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
