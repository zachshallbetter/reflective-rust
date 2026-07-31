---
title: "Prototype Crate Architecture"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Prototype Crate Architecture under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Prototype Crate Architecture

**Status:** Research synthesis

## 27. Prototype crate architecture

```text
reflect-runtime
|-  TypeInfo, FieldInfo, MethodInfo
|-  DynRef, DynMut, OwnedValue
|-  capability types
|-  safe invocation facade
`-  schema and error types

reflect-derive
|-  syntax-only descriptor generation
|-  generated getters and setters
|-  owned invocation thunks
`-  diagnostic experiments

reflect-registry
|-  explicit registry
|-  per-crate registry tables
|-  linkme backend
`-  inventory backend

reflect-workloads
|-  serialization
|-  editor generation
|-  RPC
|-  ECS registration
`-  dynamic invocation
```

`reflect-derive` is a validation vehicle, not semantic reflection. It validates the runtime ABI and workflows before compiler changes.
---

## Navigation
[← Decision Matrix](../08-reference/decision-matrix.md) | [Table of Contents](../SUMMARY.md) | [Migration Strategy →](../08-reference/migration.md)
