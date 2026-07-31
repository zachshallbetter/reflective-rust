---
title: "3-LISP"
scope: "context"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for 3-LISP under Historical Evidence & Comparative Context."
---
# 3-LISP

**Status:** Research synthesis

3-LISP formalized procedural reflection through a tower of interpreters and reflective procedures receiving descriptions of active context. The key property is not self-description alone but causal connection: a reflective description must correspond to the process and changes to the description must alter resumed computation.

For Rust, this argues against calling stack traces, debug metadata, or MIR dumps "procedural reflection." A valid design needs a retained execution representation and a certified resumption path.
---

## Navigation
[← 01 History & Lineage](../01-history/README.md) | [Table of Contents](../SUMMARY.md) | [Brian Cantwell Smith →](../01-history/brian-cantwell-smith.md)
