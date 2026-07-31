---
title: "Research Methodology"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Research Methodology under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Research Methodology

**Status:** Research synthesis

## 2. Evidence status and methodology

### 2.1 Evidence categories

| Status | Meaning |
|---|---|
| **Established** | Documented behavior of current Rust, P2996, or demonstrated repository behavior. |
| **Emerging** | Active but unstable Rust reflection/comptime work. |
| **Author inference** | Architecture derived from established constraints but not yet implemented. |
| **Recommendation** | A design choice among feasible alternatives. |

### 2.2 Primary evidence base

The principal sources are:

- C++ P2996R13, including the opaque `std::meta::info` model and splicing;
- related C++ reflection papers on access contexts, hashing, and runtime projection;
- the Rust Reference and rustc development guide;
- Rust's 2026 reflection and comptime project goal;
- CallMeMaybe and its examples;
- Brian Cantwell Smith, *Procedural Reflection in Programming Languages*;
- CLOS MOP literature and established reflective-language practice;
- practical registry crates such as `linkme` and `inventory`.

### 2.3 Governing methodological rules

The research follows the uploaded priming procedure: source-derived observations remain separate from design inferences; missing semantic information is represented as unavailable or ambiguous rather than false; implementation proposals are not presented as existing behavior; terminology is canonical and stable; limitations and threats are explicit.

---

## Operational rule

Every later claim should be tagged mentally as one of: observation, language-design proposal, implementation inference, or open research question. The proposal must not present proc-macro capabilities as semantic reflection, runtime descriptors as compiler metaobjects, or debugger metadata as procedural reflection.
---

## Navigation
[← Problem Statement](../00-foundations/01-problem-statement.md) | [Table of Contents](../SUMMARY.md) | [Ontology →](../00-foundations/03-ontology.md)
