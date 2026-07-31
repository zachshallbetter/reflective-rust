---
title: "Safety Boundaries"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Safety Boundaries under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Safety Boundaries

**Status:** Research synthesis

## 24. Threat model

| Threat | Mechanism | Mitigation |
|---|---|---|
| Wrong-type erased invocation | raw pointer paired with false type claim | sealed erased references, generated keys, checked facade |
| Aliasing violation | simultaneous mutable/shared reflection | exclusive capability tokens tied to borrows |
| Invalid borrowed return | result outlives receiver/argument | borrow-aware ABI or reject signature |
| Double drop/leak | untracked dynamic allocation | `OwnedValue` with generated drop glue |
| Private leak | names/types/counts exposed | filter before handle creation; owner projection |
| Coherence bypass | generated foreign or overlapping impl | ordinary orphan/overlap checks |
| Semantic cycle | output changes producing query | frozen snapshot |
| Compile-time denial of service | unbounded recursion/solver/output | deterministic budgets |
| Nondeterministic build | ambient host state | no ambient access; tracked inputs; canonical ordering |
| Stale incremental result | hidden dependency omitted | all intrinsics are tracked compiler queries |
| Layout misuse | build-specific offsets treated as ABI | explicit target/build marker and representation contract |
| Metadata bloat | global retention | opt-in projection and reachability stripping |
| Registry stripping | linker removes descriptors | defined retention semantics and platform tests |
| Registry collision | name or weak hash as identity | separate process/build/schema keys |
| Capability escalation | downstream fabricates write/invoke | non-forgeable generated capabilities |
| Unsafe dynamic method | hidden preconditions | explicit unsafe invocation authority |
| Invalid procedural state | inconsistent local/borrow/continuation mutation | certified safepoints and typed transitions |
---

## Navigation
[← Intercession](../05-metaobjects/intercession.md) | [Table of Contents](../SUMMARY.md) | [Compiler Contracts →](../05-metaobjects/compiler-contracts.md)
