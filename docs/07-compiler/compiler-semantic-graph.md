---
title: "Compiler Semantic Graph"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compiler Semantic Graph under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Compiler Semantic Graph

**Status:** Research synthesis

The recommended long-term abstraction is a Compiler Semantic Graph (CSG): a stable conceptual graph of items, types, traits, impls, predicates, relationships, source provenance, runtime projections, and optional execution domains.

The CSG is not a serialized dump of rustc internals. It is a language-level ontology with compiler-defined identity and query semantics. Reflection APIs, IDEs, documentation, AI systems, debuggers, schema tools, and spatial projections can consume different authorized views of the same graph.

This recommendation extends beyond the base report. It should be evaluated as a unifying architecture rather than assumed as a required first implementation.
---

## Navigation
[← Architecture Overview](../07-compiler/architecture.md) | [Table of Contents](../SUMMARY.md) | [Dependency Tracking →](../07-compiler/dependency-tracking.md)
