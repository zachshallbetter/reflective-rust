---
title: "Abstract"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Abstract under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Abstract

**Status:** Research synthesis

## Abstract

Rust can support semantic static reflection, compile-time metaprogramming, generated runtime reflection, metaobject introspection, constrained intercession, and limited procedural reflection without abandoning its safety, coherence, privacy, incremental-compilation, or zero-cost principles. It can do so only if these facilities are separated by compiler phase and authority.

The recommended architecture has four layers. First, semantic static reflection exposes compiler-resolved entities through an opaque, compiler-owned, compile-time-only `meta::Info`. Second, consteval metaprogramming executes deterministic Rust over those handles with explicit resource budgets and tracked dependencies. Third, runtime projection generates only requested descriptors and checked adapters; compiler reflection handles never survive into ordinary runtime memory. Fourth, procedural reflection operates only inside explicitly reflectable execution domains whose frames, suspension points, continuations, and mutation capabilities were designed for reflection.

This design synthesizes the strongest transferable ideas from C++ P2996 and `std::meta::info`, experimental Clang implementations, CallMeMaybe's static-to-runtime projection, Rust's current reflection/comptime initiative, Brian Cantwell Smith's 3-LISP model of causally connected procedural reflection, the CLOS Metaobject Protocol, and modern reflective or metaprogrammable languages. It rejects direct exposure of rustc internals, unrestricted private-member discovery, unbounded fixed-point generation, privileged generated implementations, unsafe type erasure disguised as reflection, and arbitrary continuation mutation.
---

## Navigation
[← 00 Foundations](../00-foundations/README.md) | [Table of Contents](../SUMMARY.md) | [Problem Statement →](../00-foundations/01-problem-statement.md)
