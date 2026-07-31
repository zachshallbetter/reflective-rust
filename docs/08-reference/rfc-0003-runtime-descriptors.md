---
title: "RFC 0003: Opt-In Zero-Cost Runtime Descriptors"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for RFC 0003: Opt-In Zero-Cost Runtime Descriptors under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# RFC 0003: Opt-In Zero-Cost Runtime Descriptors

- Feature Name: `runtime_descriptors`
- Start Date: 2026-07-31
- RFC PR: rust-lang/rfcs#0003
- Rust Issue: rust-lang/rust#00000

---

## 1. Summary

This RFC specifies **Runtime Semantic Projection**: an opt-in procedural macro framework (`#[derive(Reflectable)]`) that emits static `TypeDescriptor`, `FieldDescriptor`, and `VariantDescriptor` VTables into dedicated binary linker sections (`.reflective.descriptors`).

Un-annotated types incur **0 bytes memory overhead**, preserving Rust's zero-cost abstraction principle.

---

## 2. Motivation

Dynamic invocation, serialization frameworks, RPC routing, and ECS registries often require dynamic runtime type information. Traditional dynamic languages force all types to carry object headers. Reflective Rust allows developers to selectively opt-in on a per-type basis.

---

## 3. Reference-Level Explanation

```rust
#[derive(Reflectable)]
pub struct Player {
    pub id: u64,
    pub health: f32,
}

fn main() {
    let descriptor = Player::type_descriptor();
    assert_eq!(descriptor.name, "Player");
    assert_eq!(descriptor.fields.len(), 2);
}
```

- **Distributed Registry**: `#[derive(Reflectable)]` places static descriptor references into linker sections for runtime discovery (`reflective::registry::all_types()`).
---

## Navigation
[← RFC 0002: Compiler Semantic Graph (CSG)](../08-reference/rfc-0002-compiler-semantic-graph.md) | [Table of Contents](../SUMMARY.md) | [RFC 0004: Agentic Context Slicing & Spatial Anchors →](../08-reference/rfc-0004-agent-slicing-and-ssp.md)
