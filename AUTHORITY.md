---
title: "Hierarchy of Authority"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
---

# Hierarchy of Authority

This document defines the resolution order when research papers, formal specifications, compiler integration proposals, runtime descriptor schemas, code prototypes, or generated documentation conflict within the **Reflective Rust** research program.

---

## Canonical Resolution Order

When any two artifacts in the repository conflict or present inconsistent claims, authority is resolved in the following strict order:

$$\text{Architecture & Research Doctrine} \to \text{Canonical Ontology & Glossary} \to \text{Language Specification} \to \text{Substrate Code / Prototypes} \to \text{Generated Artifacts / Benchmarks}$$

| Level | Artifact | Location | Authority Scope |
| :---: | :--- | :--- | :--- |
| **0** | **Architecture & Research Doctrine** | [`.agents/AGENTS.md`](.agents/AGENTS.md) & [`README.md`](README.md) | Overarching principles, concentric scope boundaries, non-negotiable invariants, status honesty rules. |
| **1** | **Canonical Ontology & Glossary** | [`00-foundations/03-ontology.md`](00-foundations/03-ontology.md) & [`05-glossary.md`](00-foundations/05-glossary.md) | Universal entity naming (`core::meta::Info`, `CSG`, `RRSA`), taxonomy definitions, and terminology lanes. |
| **2** | **Language & Subsystem Specifications** | [`03-rust-language-proposal/`](03-rust-language-proposal/) & [`07-compiler/`](07-compiler/) | Formal consteval query signatures, compiler semantic graph rules, hygiene, and privacy boundaries. |
| **3** | **Substrate Code & Prototypes** | [`08-reference/prototype-crates.md`](08-reference/prototype-crates.md) | Implementation code, MIR interpreter prototypes, and reference macros. |
| **4** | **Generated Artifacts & Benchmarks** | [`llms-full.txt`](llms-full.txt), static book builds, benchmark outputs | Exported docs, serialized schemas, and evaluation data. |

---

## Operational Rules

1. **Code Never Silently Alters Theory**:
   If an experimental macro, compiler prototype, or benchmark output behaves differently from the Level 0–2 specifications, **the code contains a defect** until a formal synthesis determination explicitly updates the specification.

2. **Generated Files Are Downstream**:
   Files like `llms-full.txt`, `SUMMARY.md`, and static `book/` builds are downstream projections. They must never be manually edited to introduce new concepts not present in the canonical source files.

3. **Status Honesty Precedence**:
   If prose in a reference document claims a feature is "implemented" or "validated" while the implementation or empirical record shows otherwise, the weaker claim governs.
