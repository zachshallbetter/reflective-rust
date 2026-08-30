---
title: "Performance Evaluation Protocol"
scope: "long-term"
status: "canonical"
version: "0.1.0"
updated: "2026-08-25"
summary: "Rules for producing reproducible performance evidence without converting local timings into guarantees."
---
# Performance Evaluation Protocol

No repository-wide performance result is currently classified as empirically validated. The benchmark crate records local durations for implemented descriptor derivation and canonical hashing; it contains no pass/fail latency threshold.

An empirical claim requires all of the following in the same record:

- exact revision and dirty-tree state;
- Rust toolchain, target triple, optimization profile, CPU, operating system, and power mode;
- warm-up, sample count, statistical treatment, and raw result artifact;
- pre-registered hypothesis and invalidation threshold;
- a benchmark whose optimizer barriers and inputs preserve the work being measured;
- repeated results sufficient to characterize variance.

Compiler reflection, compiler extraction, and cross-backend conformance cannot be benchmarked by this workspace because those implementations do not exist here. Stable-Rust `size_of` results do not constitute evidence for the proposed compiler APIs.

## Current measurement surface

`reflective-rust-bench::run_measurements` measures two operations:

1. construction of a derived `TypeDescriptor`;
2. validation, JCS serialization, and SHA-256 hashing of a fixed descriptor envelope.

These measurements are diagnostic. They establish neither zero cost nor a production service-level objective.

---

## Navigation
[← Semantic Graph Agent Context Slicing](../09-research/semantic-graph-agent-slicing.md) | [Table of Contents](../SUMMARY.md) | [01 History & Lineage →](../01-history/README.md)
