---
title: "RFC 0004: Agentic Context Slicing & Spatial Anchor Protocol"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for RFC 0004: Agentic Context Slicing & Spatial Anchor Protocol under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# RFC 0004: Agentic Context Slicing & Spatial Anchor Protocol

- Feature Name: `agent_slicing_and_ssp`
- Start Date: 2026-07-31
- RFC PR: rust-lang/rfcs#0004
- Rust Issue: rust-lang/rust#00000

---

## 1. Summary

This RFC specifies:
1. **Agentic Semantic Context Slicing (`csg::slice_around`)**: Graph RAG algorithms extracting compiler-certified semantic contexts (resolved type bounds, lifetime invariants, privacy barriers) for AI tools.
2. **Semantic Spatial Projection (SSP)**: 3D $T(N_i) \in \mathbb{SE}(3)$ transformation matrix protocols mapping CSG graph nodes into physical 3D spatial environments for spatial computing and visual debugging.

---

## 2. Motivation

Raw text-based RAG pipelines fail on complex codebases because unparsed code snippets lack compiler context (resolved signatures, trait bounds, macro expansions). 

By slicing directly over the **Compiler Semantic Graph (CSG)**, AI agents receive exact, hallucination-free compiler facts.

---

## 3. Spatial Transformation Protocol

$$T(N_i) = \begin{bmatrix} R(N_i) & p(N_i) \\ 0_{1\times 3} & 1 \end{bmatrix} \in \mathbb{SE}(3)$$

CSG nodes are mapped into 3D bounding spheres, module volumes, and relational dependency lines rendered in WebGL (`apps/ssp-visualizer`).
---

## Navigation
[← RFC 0003: Opt-In Zero-Cost Runtime Descriptors](../08-reference/rfc-0003-runtime-descriptors.md) | [Table of Contents](../SUMMARY.md) | [Terminology Lanes →](../08-reference/terminology-lanes.md)
