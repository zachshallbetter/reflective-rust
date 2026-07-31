---
title: "Compile-Time Execution"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Compile-Time Execution under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Compile-Time Execution

**Status:** Research synthesis

## 10. Consteval execution model

### 10.1 Compile-time-only functions

```rust
#[compile_time_only]
pub const fn describe<T: ?Sized>() -> StaticTypeDescription {
    let ty = meta::of::<T>();
    build_description(ty)
}
```

| Property | Ordinary `const fn` | Compile-time-only `const fn` |
|---|---|---|
| Runtime call | permitted | rejected |
| `meta::Info` parameters/results | rejected | permitted |
| Required execution | only in const context | always |
| Host I/O | unavailable | unavailable |
| Semantic compiler queries | unavailable | available through tracked intrinsics |
| Runtime code for metaprogram | possible | none |

### 10.2 Determinism

A metaprogram is a pure compiler query from declared inputs to a value or generated fragment. Its fingerprint includes:

```text
metaprogram MIR
+ constant arguments
+ reflected entity fingerprints
+ access context
+ typing environment
+ target and data layout
+ crate features and cfg
+ language/compiler feature version
+ explicitly tracked external inputs
```

Ambient file reads, environment variables, current time, randomness, networking, and process execution are unavailable.

### 10.3 Tracked external inputs

Where external data is required, it enters through explicit tracked APIs:

```rust
pub const fn include_tracked(path: &TrackedPath) -> TrackedBytes;
```

The path identity and content hash become incremental dependencies.

### 10.4 Resource accounting

| Resource | Accounting unit | Diagnostic requirement |
|---|---|---|
| Execution | MIR interpreter steps | show call stack and largest consumers |
| Memory | peak consteval allocation | show allocation site and retained object |
| Reflection | semantic query count | show repeated query and entity |
| Recursion | metaprogram call depth | show cycle or deepest chain |
| Generation | number and size of emitted entities | show generator and output category |
| Solver work | goals and recursion | distinguish ambiguity from budget exhaustion |

Limits are reproducible compilation inputs. Raising a limit permits completion; it must not alter a successful semantic result.
---

## Navigation
[← Semantic Reflection](../03-rust-language-proposal/semantic-reflection.md) | [Table of Contents](../SUMMARY.md) | [Reification →](../03-rust-language-proposal/reification.md)
