---
title: "Problem Statement"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Problem Statement under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Problem Statement

**Status:** Research synthesis

## 1. Research question and scope

### 1.1 Canonical research question

How can Rust support semantic static reflection, compile-time metaprogram execution, generated runtime introspection, metaobject introspection/intercession, and procedural reflection without weakening soundness, coherence, predictable compilation, privacy, incremental compilation, or zero-cost-by-default?

### 1.2 Included facilities

This report covers:

- semantic reflection after name resolution and type analysis;
- contextual trait and normalization queries;
- compile-time-only evaluation over reflected entities;
- typed reification and declaration generation;
- opt-in runtime type descriptors and dynamic invocation;
- registry construction and linker integration;
- privacy and cross-crate access control;
- generated-implementation coherence;
- diagnostics and incremental compilation;
- metaobject introspection and constrained intercession;
- procedural reflection over active computation;
- implementation sequencing and evaluation.

### 1.3 Excluded claims

This report does not claim that:

- procedural macros already provide semantic reflection;
- all compiler facts exist at one universal post-analysis point;
- runtime reflection follows automatically from static reflection;
- full 3-LISP-equivalent reflection is feasible over arbitrary optimized native Rust;
- an unrestricted CLOS-style MOP is compatible with Rust's safety model;
- the proposed surface syntax has been accepted by the Rust project.
---

## Navigation
[← Abstract](../00-foundations/00-abstract.md) | [Table of Contents](../SUMMARY.md) | [Research Methodology →](../00-foundations/02-research-methodology.md)
