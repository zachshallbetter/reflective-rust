---
title: "Compiler Conformance Vectors"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compiler Conformance Vectors under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Compiler Conformance Vectors

> **Status:** Canonical Compiler Verification Specification  
> **Adapted from:** FCI Freestanding Conformance Assertions  

This document specifies the cross-backend determinism testing protocol for **Reflective Rust (`core::meta::Info`)** and the **Compiler Semantic Graph (CSG)**.

---

## 1. The Multi-Backend Determinism Problem

Rust compilers support multiple code-generation backends:
- `cg_llvm` (default LLVM backend)
- `cg_clif` (Cranelift backend)
- `cg_gcc` (GCC backend)

A static reflection system (`core::meta::Info`) and consteval metaprogramming suite claiming deterministic evaluation must produce **identical semantic facts and reification outputs** regardless of which backend or host target is active during compilation.

---

## 2. Conformance Vector Protocol

To verify multi-backend determinism, Reflective Rust defines a binary conformance vector - a deterministic hash stream of all resolved `meta::Info` queries, layout calculations, and hygienic token streams across a standard conformance test suite (`reflective-conformance-suite`).

```text
                                CONFORMANCE PIPELINE
┌─────────────────────────┐
│ Conformance Test Suite  │
└────────────┬────────────┘
             │
      ┌──────┴──────────────────────────┬─────────────────────────┐
      ▼                                 ▼                         ▼
┌───────────┐                     ┌───────────┐             ┌───────────┐
│  cg_llvm  │                     │  cg_clif  │             │  cg_gcc   │
└─────┬─────┘                     └─────┬─────┘             └─────┬─────┘
      │                                 │                         │
      ▼                                 ▼                         ▼
llvm_vector.bin                   clif_vector.bin           gcc_vector.bin
      │                                 │                         │
      └─────────────────────────┬───────┴─────────────────────────┘
                                ▼
                   cmp llvm_vector.bin clif_vector.bin
                   cmp llvm_vector.bin gcc_vector.bin
```

---

## 3. Automated CI Enforcement Gate

In CI workflows, reflection test suites build under all available codegen backends and assert byte-identity:

```bash
# Verify consteval reflection query determinism across LLVM and Cranelift
cargo test --Zcodegen-backend=llvm -- --emit-conformance-vector > llvm_vector.bin
cargo test --Zcodegen-backend=cranelift -- --emit-conformance-vector > clif_vector.bin

cmp --silent llvm_vector.bin clif_vector.bin || (
    echo "ERROR: Cross-backend reflection mismatch! LLVM and Cranelift emitted divergent semantic vectors." && exit 1
)
```

This prevents backend-specific builtin assumptions or target-specific alignment differences from corrupting compiler reflection query results.
---

## Navigation
[← Implementation Roadmap](../07-compiler/implementation-roadmap.md) | [Table of Contents](../SUMMARY.md) | [Incremental Trace Verification →](../07-compiler/incremental-trace-verification.md)
