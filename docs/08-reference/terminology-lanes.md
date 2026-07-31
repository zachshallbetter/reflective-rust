---
title: "Terminology Lanes & Schema Governance"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Terminology Lanes & Schema Governance under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Terminology Lanes & Schema Governance

> **Status:** Canonical Reference Specification  
> **Adapted from:** Fundamental Engine Terminology Lanes Policy  

To keep **Reflective Rust (RRSA)** inspectable, deterministic, and clear, terms across compiler phases, language proposals, runtime systems, and spatial interfaces are partitioned into strict **Terminology Lanes**.

---

## 1. The Four Terminology Lanes

```text
┌─────────────────────────────────────────────────────────────────────────┐
│ LANE 1: CONCEPT LANE   :: Language semantics & theoretical entities     │
├─────────────────────────────────────────────────────────────────────────┤
│ LANE 2: SUBSTRATE LANE :: Compiler Semantic Graph & consteval handles  │
├─────────────────────────────────────────────────────────────────────────┤
│ LANE 3: RUNTIME LANE   :: Opt-in runtime descriptors & dynamic adapters │
├─────────────────────────────────────────────────────────────────────────┤
│ LANE 4: SPATIAL LANE   :: Spatial projections & 3D environment nodes   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Term | Concept Lane | Substrate Lane (CSG) | Runtime Lane | Spatial Lane (SSP) |
| :--- | :--- | :--- | :--- | :--- |
| **Handle / Object** | Reflection Entity | `core::meta::Info` | `TypeDescriptor` | Spatial Structure |
| **Attribute** | Declaration Field | Field Node | `FieldAccess` | Boundary / Component |
| **Execution** | Metaprogramming | `consteval` Context | Dynamic Invocation | Active Flow Line |
| **Authority** | Language Spec | Semantic Graph | Reflection Registry | World Model Node |

---

## 2. Governance Invariants

1. **No Cross-Lane Alias Collision**:
   `meta::Info` is exclusively a compile-time-only handle in Lane 2. It must *never* be used as a name for a runtime struct in Lane 3 or a spatial object in Lane 4.
2. **Explicit Adapter Boundaries**:
   Converting an entity from Lane 2 to Lane 3 requires explicit reification via a runtime projection adapter. It is never implicit.
3. **Deprecated Aliases**:
   When renaming an entity to conform to terminology lanes, old names must be marked `@deprecated` for one major cycle rather than silently removed.
---

## Navigation
[← RFC Template](../08-reference/rfc-template.md) | [Table of Contents](../SUMMARY.md) | [04 Runtime Semantic Projection →](../04-runtime/README.md)
