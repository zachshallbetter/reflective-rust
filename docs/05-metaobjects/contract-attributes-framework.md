---
title: "Metaobject Contract Attributes Framework"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Metaobject Contract Attributes Framework under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Metaobject Contract Attributes Framework

> **Status:** Canonical Metaobject Specification  
> **Adapted from:** Fundamental Engine System Contract Meta Framework  

Every Metaobject Protocol (MOP) adapter and runtime projection generator in **Reflective Rust** must define an explicit **Contract Meta Specification** to ensure safety, inspectability, and pure separation of phases.

---

## 1. The Five Contract Attributes

```rust
pub struct MetaobjectContract {
    pub name: &'static str,
    pub must_exist: &'static str,
    pub may_mutate: &'static str,
    pub side_effect_free: &'static str,
    pub testable: &'static str,
    pub inspectable: &'static str,
}
```

| Contract Attribute | Definition | RRSA Enforcement Rule |
| :--- | :--- | :--- |
| **`must_exist`** | The required data model / semantic handle schema | Declated in `core::meta` or `TypeDescriptor`. |
| **`may_mutate`** | Permitted state changes during reification | Strictly bounded to newly reified tokens or descriptors; cannot mutate existing AST nodes. |
| **`side_effect_free`** | Consteval purity & side-effect assertions | All reflection queries are pure functions over compiler state snapshots. |
| **`testable`** | Quantitative conformance test vector requirement | Subject to cross-backend byte-identical vector tests (`compiler-conformance-vectors`). |
| **`inspectable`** | Tooling & CSG visibility requirement | Exposed via `CSG` graph queries for IDEs, debuggers, and AI agents. |

---

## 2. Standard MOP Contracts

### Introspection MOP Contract
- **`must_exist`**: `Info` handle, semantic kind, attributes, fields, traits.
- **`may_mutate`**: None (pure read-only query surface).
- **`side_effect_free`**: 100% pure; cached deterministically by compiler query engine.
- **`testable`**: Verified against `reflective-conformance-suite`.
- **`inspectable`**: Visible in IDE autocompletion and Compiler Semantic Graph projections.

### Generation MOP Contract
- **`must_exist`**: Target item handle + reification template.
- **`may_mutate`**: Emits new hygienic Rust token streams into current module scope.
- **`side_effect_free`**: Pure function of input `Info` handles and static consteval parameters.
- **`testable`**: Generated code must pass ordinary compiler safety, privacy, and borrow checks.
- **`inspectable`**: Macro expansion outputs inspectable via `cargo expand` and CSG nodes.
---

## Navigation
[← Compiler Contracts](../05-metaobjects/compiler-contracts.md) | [Table of Contents](../SUMMARY.md) | [07 Compiler Architecture & CSG →](../07-compiler/README.md)
