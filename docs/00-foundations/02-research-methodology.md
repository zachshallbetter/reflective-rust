---
title: "Research Methodology & Empirical Rigor"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Research Methodology & Empirical Rigor under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Research Methodology & Empirical Rigor

> **Status:** Canonical Research Doctrine  

---

## 1. Philosophical Framework & Four-Tier Claim Taxonomy

To ensure uncompromised scientific integrity, **Reflective Rust** enforces the strict **Four-Tier Claim Taxonomy** defined in [`AGENTS.md`](../../.agents/AGENTS.md):

$$\text{Documented} \neq \text{Implemented} \neq \text{Tested} \neq \text{Empirically Validated}$$

### 1.1 Taxonomy Definitions
1. **Documented**: A feature or architectural design specified in formal RFCs or documentation chapters.
2. **Implemented**: Executable source code written and compiled into reference workspace crates under `crates/`.
3. **Tested**: Source code validated by passing unit tests and integration test suites (`cargo test`).
4. **Empirically Validated**: Measured performance data gathered from pre-registered benchmarks (`reflective-rust-bench`) under automated CI gates.

---

## 2. Prospective Pre-Registration & Invalidation Triggers

Every empirical claims matrix, benchmark suite, or compiler behavior change must pre-register success thresholds and invalidation triggers *before* executing tests:

| Subsystem | Metric | Target | Invalidation Threshold | Verification Tool |
| :--- | :--- | :--- | :--- | :--- |
| Static Reflection (`core::meta`) | Latency | $< 500 \text{ ns/op}$ | $> 2.0 \ \mu\text{s/op}$ | `reflective-rust-bench` |
| Runtime VTable Lookup | Latency | $< 20 \text{ ns/op}$ | $> 100 \text{ ns/op}$ | `reflective-rust-bench` |
| Un-annotated Memory Overhead | Memory Size | **`0 bytes`** | $> 0 \text{ bytes}$ | `scripts/verify-value-metrics.py` |
| Cross-Backend CSG Schema | Conformance | **100% Match** | Byte Mismatch | `reflective-rust-conformance` |

---

## 3. Permanent Retention of Negative Results

In accordance with academic research standards, disproven hypotheses and abandoned architectural directions are recorded permanently in [`docs/09-research/rejected-designs.md`](../09-research/rejected-designs.md). No disproven direction is ever pruned, preventing future researchers from re-proposing failed design intuitions.
---

## Navigation
[← Problem Statement](../00-foundations/01-problem-statement.md) | [Table of Contents](../SUMMARY.md) | [Ontology →](../00-foundations/03-ontology.md)
