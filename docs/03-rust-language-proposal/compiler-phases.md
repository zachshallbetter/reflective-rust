---
title: "Compiler Phases"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compiler Phases under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Compiler Phases

**Status:** Research synthesis

## 6. Compiler phases and query availability

Rust has no single point where every semantic fact is final. Reflection queries must state their prerequisites.

| Semantic stratum | Compiler knowledge | Candidate queries | Required failure states |
|---|---|---|---|
| **Expanded** | Items and attributes after ordinary macro expansion | syntax origin, raw declared attributes | expansion incomplete |
| **Resolved** | Definitions, namespaces, paths, parent relationships, visibility | kind, identity, parent, fields, variants | unresolved, inaccessible, incomplete |
| **Item-typed** | Resolved signatures, generics, predicates, field types | `type_of`, `signature_of`, `predicates_of` | type collection error, opaque component |
| **Body-typed** | Inferred local/expression types, method candidates, coercions | local type, call resolution, coercion | body not checked, inference incomplete |
| **Normalized** | Contextual normalization and trait goals | normalize, prove, selected candidate | ambiguous, overflow, no solution, cycle |
| **Layout-known** | Size, alignment, ABI class, offsets for concrete target/type | layout, field layout | generic, unsized, opaque, target absent |
| **Monomorphized** | Concrete instances and codegen-selected calls | instance, selected impl, concrete ABI | no reachable instance, still polymorphic |

### 6.1 Query result algebra

Missing information must not become `false`, an empty list, zero, or null.

```rust
pub enum Query<T> {
    Known(T),
    Unavailable(Requirement),
    Ambiguous(Ambiguity),
    Error(MetaError),
}

pub enum Requirement {
    CompleteDefinition,
    BodyTypeChecked,
    ConcreteSubstitutions,
    SizedType,
    TargetLayout,
    MonomorphizedInstance,
    OwnerAuthorization,
}

pub enum Ambiguity {
    InferenceVariable,
    MultipleTraitCandidates,
    UnnormalizedAlias,
    OpaqueType,
    SolverCycle,
}
```

`Unavailable` means the fact cannot yet or generally exist. `Ambiguous` means the semantic question is valid but lacks a unique answer under the supplied environment.
---

## Navigation
[← Reflection Queries](../03-rust-language-proposal/reflection-queries.md) | [Table of Contents](../SUMMARY.md) | [Diagnostics →](../03-rust-language-proposal/diagnostics.md)
