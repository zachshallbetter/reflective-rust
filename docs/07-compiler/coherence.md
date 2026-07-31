---
title: "Coherence"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Coherence under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Coherence

**Status:** Research synthesis

## 13. Generated implementations and coherence

Generated `impl`s are ordinary Rust once materialized. They pass:

- orphan checks;
- overlap checks;
- well-formedness;
- privacy checks;
- unsafe implementation obligations;
- downstream coherence analysis.

Reflection creates no privileged implementation mode.

### 13.1 Prefer local artifacts over global claims

```text
Global claim:
    impl ForeignTrait for ForeignType
    -> coherence-sensitive and often illegal

Local artifact:
    const SERIALIZER_FOR_T: SerializerFn<T>
    -> ordinary local item
```

The default recommendation is to generate companion functions, tables, or descriptors. Generate trait implementations only where the equivalent handwritten implementation is legal and semantically appropriate.
---

## Navigation
[← Hygiene](../07-compiler/hygiene.md) | [Table of Contents](../SUMMARY.md) | [Privacy Architecture →](../07-compiler/privacy.md)
