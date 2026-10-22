---
title: "Frequently Asked Questions"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-10-22"
summary: "Reflective Rust research specification for Frequently Asked Questions under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Frequently Asked Questions

**Status:** Research synthesis

## Is a proc macro reflection?
It is syntax metaprogramming. It may approximate reflection for local declarations but lacks compiler-resolved semantic facts.

## Does runtime reflection require RTTI everywhere?
The implemented derive-based descriptor path is opt-in: descriptor values are produced when requested. This does not establish a compiler-level zero-cost guarantee or mean the proposed compiler reflection API exists.

## Can reflection bypass privacy?
The proposal requires access filtering before handles or adapters are produced. The workspace does not implement compiler-enforced reflection privacy; runtime projection only filters access metadata already present in the supplied descriptor.

## Can a metaprogram generate an impl?
Yes, but the impl remains subject to ordinary coherence, orphan, overlap, privacy, and unsafe checks.

## Is full procedural reflection available for arbitrary optimized Rust?
No. The defensible path is an explicit reflectable execution domain.
---

## Navigation
[← Migration Strategy](../08-reference/migration.md) | [Table of Contents](../SUMMARY.md) | [RFC Template →](../08-reference/rfc-template.md)
