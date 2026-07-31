---
title: "Implementation Roadmap"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Implementation Roadmap under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Implementation Roadmap

**Status:** Research synthesis

## 28. Phased implementation roadmap

| Milestone | Deliverable | Exit criterion |
|---|---|---|
| Runtime model prototype | descriptors, safe erased values, owned invocation, capabilities | Miri passes; safe API cannot fabricate wrong typed reference |
| Syntax projection prototype | derive-generated descriptors and thunks | validates runtime ABI; explicitly labeled syntax-based |
| Registry prototype | explicit, `linkme`, optional `inventory` backends | cross-platform LTO/dead-strip tests pass |
| Workload suite | serialization, editor, RPC, ECS, dynamic invocation | required semantic queries are enumerated |
| Read-only rustc reflection | experimental compiler-owned `Info` | privacy-filtered consteval-only queries work |
| Consteval integration | compile-time-only functions and budgets | reproducible execution and incremental invalidation |
| Contextual semantic queries | normalization, proof, layout, instances | ambiguity/unavailability represented explicitly |
| Runtime projector | compiler-supported descriptor emission | zero unused runtime cost |
| Typed reification | typed holes for type/path/expression/item/member | hygiene and ordinary diagnostics preserved |
| Staged generation | frozen snapshot and one-way materialization | same-stage cycles rejected deterministically |
| Owner-authorized private projection | lexical access context | negative privacy tests show no leakage |
| Borrow-aware invocation | generated call-frame ABI | Miri lifetime/alias tests pass |
| Procedural reflection MVP | instrumented async/coroutine domains | certified inspect/replace/resume only |
| MIR interpreter backend | articulated frames and continuations | causal inspection and controlled resumption demonstrated |
| Resumable MIR experiment | synchronous annotated state machines | borrow/drop invariants preserved |
---

## Navigation
[← Optimization Boundaries](../07-compiler/optimization.md) | [Table of Contents](../SUMMARY.md) | [Compiler Conformance Vectors →](../07-compiler/compiler-conformance-vectors.md)
