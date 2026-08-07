---
title: "Reflection Taxonomy"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Reflection Taxonomy under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Reflection Taxonomy

**Status:** Research synthesis

The architecture distinguishes six related but non-equivalent mechanisms:

1. **Syntax transformation** - source/token manipulation before full semantic resolution.
2. **Semantic static reflection** - compiler-resolved program entities exposed during compilation.
3. **Compile-time metaprogramming** - deterministic execution that consumes semantic handles and emits values or Rust fragments.
4. **Runtime reflection** - intentionally emitted runtime descriptors and adapters.
5. **Metaobject protocols** - language-level protocols for inspecting or participating in selected operations.
6. **Procedural reflection** - causally connected access to active computation and its continuation.

A major design requirement is preventing accidental collapse between these categories. Each has different staging, safety, authority, and implementation constraints.
---

## Navigation
[← Ontology](../00-foundations/03-ontology.md) | [Table of Contents](../SUMMARY.md) | [Glossary →](../00-foundations/05-glossary.md)
