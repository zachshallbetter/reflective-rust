---
title: "CLOS Metaobject Protocol"
scope: "context"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for CLOS Metaobject Protocol under Historical Evidence & Comparative Context."
---
# CLOS Metaobject Protocol

**Status:** Research synthesis

The CLOS MOP shows that reflection becomes substantially more powerful when the language exposes protocols governing class creation, method dispatch, slot access, and inheritance. The Rust proposal adopts the protocol idea but rejects unrestricted intercession over soundness-critical mechanisms.

Transferable pattern: expose descriptive metaobjects broadly, but permit intercession only through narrowly specified protocols whose output remains ordinary Rust checked by the compiler.
---

## Navigation
[← Brian Cantwell Smith](../01-history/brian-cantwell-smith.md) | [Table of Contents](../SUMMARY.md) | [Historical Timeline →](../01-history/historical-timeline.md)
