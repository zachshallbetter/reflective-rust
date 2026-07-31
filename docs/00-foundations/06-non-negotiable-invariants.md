---
title: "Non-Negotiable Invariants"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Non-Negotiable Invariants under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Non-Negotiable Invariants

**Status:** Research synthesis

## 5. Non-negotiable invariants

1. **No semantic query before its prerequisites.** Queries report explicit unavailability or ambiguity.
2. **No public compiler-internal ABI.** Reflection handles cannot expose rustc lifetimes or internal node layouts.
3. **No ambient compile-time authority.** Consteval metaprograms cannot access arbitrary files, networks, clocks, or processes.
4. **No private-structure discovery by default.** Inaccessible entities are filtered before handles are created.
5. **No coherence exception for generated code.** Generated implementations pass ordinary orphan and overlap checks.
6. **No backward semantic influence.** A metaprogram cannot change the semantic snapshot it observed.
7. **No raw erased call through safe APIs.** Dynamic invocation validates type, receiver, mutability, ownership, and supported lifetime relationships.
8. **No runtime metadata tax without request.** Compiler metadata disappears unless projected.
9. **No arbitrary continuation mutation.** Procedural intercession is limited to certified transitions.
10. **No false equivalence between layout and API.** Layout reflection is target/build specific unless representation guarantees say otherwise.
---

## Navigation
[← Glossary](../00-foundations/05-glossary.md) | [Table of Contents](../SUMMARY.md) | [Research Practices →](../00-foundations/07-research-practices.md)
