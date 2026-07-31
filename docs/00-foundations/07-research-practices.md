---
title: "Research Practices & Epistemic Protocol"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Research Practices & Epistemic Protocol under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Research Practices & Epistemic Protocol

> **Status:** Canonical Research Doctrine  
> **Adapted from:** Foundations of Computational Interaction (FCI) Empirical Protocol  

This document defines the empirical protocol, evidence standards, preregistration criteria, and negative result retention policies governing all research, benchmarks, and language proposals in **Reflective Rust**.

---

## 1. Separation of Maturity and Provenance

A research claim's **maturity** (how settled it is) and its **provenance** (what empirical evidence backs it) are separate dimensions:

$$\text{Maturity} \in \{\text{Documented}, \text{Implemented}, \text{Tested}, \text{Empirically Validated}\}$$
$$\text{Provenance} \in \{\text{Synthetic Fixture}, \text{Internal Benchmark}, \text{External Workload}, \text{Compiler Pass Record}\}$$

### Crucial Principle
A benchmark or fixture written alongside the implementation it tests **cannot falsify that design**. It establishes reference-kernel behavior only, not empirical advantage or real-world performance gains.

---

## 2. Permanent Retention of Negative Results

In language design and reflection architecture, abandoned intuitions are frequently re-proposed if their invalidation is not recorded.

### Invalidation Policy
1. **Never Prune Discredited Designs**: If a reflection API approach, consteval indexing scheme, or runtime descriptor layout is tested and found flawed, it is moved to [`09-research/rejected-designs.md`](../09-research/rejected-designs.md) with full empirical rationale.
2. **Discredited Metrics**: Synthetic metrics (such as token overlap or syntax density) that fail validation against production workloads are retained with an explicit discrediting report.

---

## 3. Prospective Pre-Registration Protocol

All benchmarks, compiler performance evaluations, and language ergonomics studies must define success criteria and invalidation triggers **before** running experiments:

```text
PRE-REGISTRATION TEMPLATE
------------------------------------------------------------------------
1. Hypothesis: Clear statement of predicted behavior/performance.
2. Baselines: Naive baseline, macro-only baseline, procedural baseline.
3. Measurement Apparatus: Isolated benchmark suite & compiler flags.
4. Falsification Condition: Quantitative criteria that reject hypothesis.
5. Commitment: Publish results regardless of outcome.
------------------------------------------------------------------------
```

Accuracy is expected to drop as evaluation scope widens; if accuracy rises with scope, the pre-registered predictions were written to be overly safe.
---

## Navigation
[← Non-Negotiable Invariants](../00-foundations/06-non-negotiable-invariants.md) | [Table of Contents](../SUMMARY.md) | [03 Rust Language Proposal →](../03-rust-language-proposal/README.md)
