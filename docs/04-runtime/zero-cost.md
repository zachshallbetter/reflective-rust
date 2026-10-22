---
title: "Zero-Cost Criterion"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Zero-Cost Criterion under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Zero-Cost Criterion

**Status:** Research synthesis — target criteria, not verified guarantees

## 25. Proposed zero-cost criterion

For this proposal, "zero cost" is a target criterion, not a result established by the current workspace. A future implementation would need reproducible code-size, memory, and performance measurements to support a claim. The intended criteria are:

1. A program that does not use reflection emits no reflection metadata or registry machinery.
2. Compile-time reflection handles and metaprogram code do not exist at runtime.
3. Static projections optimize like handwritten adapters.
4. Runtime descriptors and thunks are emitted only for requested, reachable capabilities.

Dynamic name lookup, descriptor traversal, type checks, and erased invocation generally introduce time or space costs. The actual cost profile must be measured for a concrete implementation and workload.
---

## Navigation
[← ECS Integration](../04-runtime/ecs.md) | [Table of Contents](../SUMMARY.md) | [Opt-In Descriptor Registries →](../04-runtime/opt-in-descriptor-registries.md)
