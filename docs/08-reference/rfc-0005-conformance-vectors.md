---
title: "RFC 0005: Cross-Backend Conformance Vectors & Schema Validation"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for RFC 0005: Cross-Backend Conformance Vectors & Schema Validation under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# RFC 0005: Cross-Backend Conformance Vectors & Schema Validation

- Feature Name: `compiler_conformance_vectors`
- Start Date: 2026-07-31
- Proposal status: repository research draft; compiler conformance not implemented

---

## 1. Summary

This RFC specifies **Cross-Backend Conformance Vector Validation**: a test matrix architecture enforcing byte-identical Compiler Semantic Graph (CSG) schema outputs regardless of whether `rustc` is targeting LLVM (`rustc_codegen_llvm`), Cranelift (`rustc_codegen_cranelift`), or GCC (`rustc_codegen_gcc`).

---

## 2. Motivation

Multiple compiler backends are essential for Rust's compiler ecosystem (fast debug builds via Cranelift, production optimizations via LLVM, embedded platform support via GCC). To prevent out-of-process toolchains (IDEs, AI agents, visualizers) from observing backend-dependent semantic behavior, CSG outputs must be proven byte-identical across all backends.

---

## 3. Reference-Level Explanation

Future conformance runners must compare independently extracted semantic vectors, not cloned fixtures or JSON length. Exact byte identity is required only after target-dependent facts are normalized or explicitly parameterized by target.

The current `reflective-rust-conformance` crate verifies literal golden hashes for the implemented RSP canonicalization protocol. It does not expose compiler backend types and is not evidence for LLVM, Cranelift, or GCC equivalence.
---

## Navigation
[← RFC 0004: Agentic Context Slicing & Spatial Anchors](../08-reference/rfc-0004-agent-slicing-and-ssp.md) | [Table of Contents](../SUMMARY.md) | [Terminology Lanes →](../08-reference/terminology-lanes.md)
