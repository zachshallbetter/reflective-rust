---
title: "Rejected Designs"
scope: "long-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Rejected Designs under Scope III: Long-Term (Reflective Environments, AI Tooling & Spatial Projection)."
---
# Rejected Designs

**Status:** Research synthesis

Rejected or deferred directions include:

- exposing HIR, THIR, MIR, `DefId`, or `Ty` as public language APIs;
- treating proc macros as the semantic-reflection layer;
- retaining all reflection metadata at runtime by default;
- unrestricted private-member discovery;
- fixed-point generation without a bounded convergence model;
- privileged generated impls that bypass coherence;
- dynamic invocation based on unchecked `Any` casts or raw pointers;
- arbitrary native stack mutation presented as safe procedural reflection;
- one universal "post-semantic-analysis" reflection phase.
---

## Navigation
[← Open Problems](../09-research/open-problems.md) | [Table of Contents](../SUMMARY.md) | [Publication Plan →](../09-research/publication-plan.md)
