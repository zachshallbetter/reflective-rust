---
title: "Incremental Compilation"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Incremental Compilation under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Incremental Compilation

**Status:** Research synthesis

## 20. Incremental compilation

Every semantic query issued by a metaprogram becomes an incremental dependency edge.

```text
meta_eval(generator, arguments, access_context, target)
    depends on:
        type_shape(Record)
        field_type(Record::id)
        field_type(Record::name)
        attribute(Record::cache, reflect_skip)
        target_layout only if queried
```

A hidden private-field change should not invalidate an external public projection that could not observe it. An owner-side serializer that did observe the field must be invalidated.

Generated output receives a stable structural fingerprint independent of allocation order, thread scheduling, or global counters. Generated identifiers derive from generator identity, invocation identity, semantic inputs, and output ordinal.
---

## Navigation
[← Dependency Tracking](../07-compiler/dependency-tracking.md) | [Table of Contents](../SUMMARY.md) | [Hygiene →](../07-compiler/hygiene.md)
