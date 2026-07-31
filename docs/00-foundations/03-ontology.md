---
title: "Canonical Ontology"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Canonical Ontology under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Canonical Ontology

**Status:** Research synthesis

## 3. Canonical ontology

| Construct | Canonical definition | Excluded adjacent construct |
|---|---|---|
| **Syntax metaprogramming** | Transformation of tokens or parsed syntax before complete semantic analysis. | Does not imply resolved type or trait knowledge. |
| **Semantic static reflection** | Compile-time access to compiler-resolved program entities and properties. | Not a proc macro's parsed representation. |
| **Reflection handle** | Opaque compile-time identity for a semantic entity. | Not a public wrapper around `DefId`, HIR, THIR, MIR, or `Ty<'tcx>`. |
| **Consteval metaprogram** | Rust code required to execute during compilation and permitted to manipulate reflection handles. | Not an ordinary function that may execute at runtime. |
| **Reification** | Conversion of a reflected semantic entity into a grammatical Rust role. | Not string-based code generation. |
| **Generation** | Materialization of new Rust entities from compile-time computation. | Not mutation of already analyzed compiler state. |
| **Runtime projection** | Descriptors and adapters intentionally emitted from static semantic knowledge. | Not retention of compiler reflection handles. |
| **Metaobject introspection** | Inspection of structures governing types, traits, implementations, and operations. | Does not necessarily modify those structures. |
| **Constrained intercession** | Participation in an enumerated protocol whose result remains ordinary compiler-checked Rust. | Not replacement of borrow checking or coherence. |
| **Procedural reflection** | Causally connected access to an active computation's environment, continuation, and state. | Not ordinary runtime type reflection. |
| **Reflectable execution domain** | An execution regime deliberately compiled or interpreted so that certified processor state can be inspected and resumed. | Not arbitrary optimized native execution. |
| **Causal connection** | A guarantee that reflected state describes and can consequentially affect the computation it represents. | Not debug metadata that merely resembles source state. |
---

## Navigation
[← Research Methodology](../00-foundations/02-research-methodology.md) | [Table of Contents](../SUMMARY.md) | [Taxonomy →](../00-foundations/04-taxonomy.md)
