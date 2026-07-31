---
title: "Open Research Questions"
scope: "long-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Open Research Questions under Scope III: Long-Term (Reflective Environments, AI Tooling & Spatial Projection)."
---
# Open Research Questions

**Status:** Research synthesis

## 30. Open research questions

1. Which semantic properties should be stable across crate boundaries?
2. How should access authority flow through library-defined metaprograms called from owner modules?
3. Which normalization and trait-selection results are meaningful before monomorphization?
4. How should reflected opaque types and existential identities be represented?
5. What typed quotation syntax best integrates with Rust grammar and diagnostics?
6. Which borrowed method signatures admit a sound erased runtime ABI?
7. How should schema identity and compatibility be versioned independently of compiler identity?
8. What compilation budget defaults prevent denial of service without harming legitimate metaprograms?
9. How much process state can be exposed without freezing MIR implementation details into language guarantees?
10. Can explicit multi-stage generation be added without introducing implicit fixed-point semantics?
11. How should reflection interact with specialization, negative impls, auto traits, and future trait-solver evolution?
12. What reflection behavior is permitted for unsafe fields, union members, pinned/self-referential types, and foreign ABIs?
---

## Navigation
[← Semantic Spatial Projection (SSP)](../09-research/ssp-companion.md) | [Table of Contents](../SUMMARY.md) | [Rejected Designs →](../09-research/rejected-designs.md)
