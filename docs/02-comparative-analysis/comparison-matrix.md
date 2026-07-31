---
title: "Comparison Matrix"
scope: "context"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Comparison Matrix under Historical Evidence & Comparative Context."
---
# Comparison Matrix

**Status:** Research synthesis

| System | Semantic static reflection | Compile-time execution | Runtime reflection | Intercession | Process reflection |
|---|---:|---:|---:|---:|---:|
| C++ P2996 | Strong proposal | `consteval` | Generated externally | Limited | No |
| Rust today | No native stable facility | `const`/macros | Library/generated | Very limited | Debugger/interpreter only |
| D | Strong | Strong | Generated/library | Limited | No |
| Zig | Strong type introspection | Strong comptime | Generated/library | Limited | No |
| Nim | Semantic AST macros | Strong | Generated/library | Moderate | No |
| CLOS | Runtime metaobjects | Runtime | Strong | Strong | Limited |
| Genera | Live semantic environment | Interactive | Strong | Strong | Practical debugging reflection |
| 3-LISP | Interpreter-level | Reflective tower | N/A | Strong | Defining feature |
---

## Navigation
[← CallMeMaybe](../02-comparative-analysis/callmemaybe.md) | [Table of Contents](../SUMMARY.md) | [Diagrams →](../diagrams/README.md)
