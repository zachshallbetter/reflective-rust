---
title: "Reflective Rust Runnable Examples"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Reflective Rust Runnable Examples under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Reflective Rust Runnable Examples

This guide documents the runnable toolchain examples located across the [`crates/`](../../crates) workspace.

---

## 1. Example 01: Static Semantic Reflection (`core::meta`)

Demonstrates compile-time opaque handle lookup (`Info`), layout introspection, and field reflecting in `#![no_std]`.

```bash
cargo run --example static_reflection -p reflective-rust-meta
```

```rust
use reflective_rust_meta::{fields_of, layout_of, of, Info, Kind};

struct Player {
    id: u64,
    active: bool,
}

fn main() {
    const PLAYER_INFO: Info = of::<Player>();
    let layout = layout_of::<Player>();
    println!("Type Handle ID: 0x{:016X}", PLAYER_INFO.id());
    println!("Memory Size   : {} bytes", layout.size);
}
```

---

## 2. Example 02: Opt-In Zero-Cost Runtime Descriptors (`#[derive(Reflectable)]`)

Demonstrates emitting static `TypeDescriptor` VTables for opt-in runtime reflection without GC or memory overhead for un-annotated types.

```bash
cargo run --example runtime_descriptors -p reflective-rust-derive
```

```rust
use reflective_rust_derive::Reflectable;

#[derive(Reflectable)]
struct GameEntity {
    id: u64,
    health: f32,
}

fn main() {
    let descriptor = GameEntity::type_descriptor();
    println!("Type Name: {}", descriptor.name);
    for field in descriptor.fields {
        println!("  - Field: {} (Offset: {})", field.name, field.offset);
    }
}
```

---

## 3. Example 03: Compiler Semantic Graph (CSG) & JSON Serialization

Demonstrates constructing a `CompilerSemanticGraph`, creating nodes and edges, and serializing out-of-process JSON schemas.

```bash
cargo run --example csg_query -p reflective-rust-csg
```

---

## 4. Example 04: Graph RAG CSG Agent Context Slicing (`csg::slice_around`)

Demonstrates extracting compiler-certified semantic slices (types, trait bounds, privacy barriers) for zero-search AI tool context resolution.

```bash
cargo run --example agent_slicing -p reflective-rust-agent
```
---

## Navigation
[← Proposed API](../08-reference/proposed-api.md) | [Table of Contents](../SUMMARY.md) | [Cookbook →](../08-reference/cookbook.md)
