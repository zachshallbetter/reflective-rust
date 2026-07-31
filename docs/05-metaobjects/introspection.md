---
title: "Metaobject Introspection"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Metaobject Introspection under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Metaobject Introspection

**Status:** Research synthesis

## 22. Metaobject introspection and constrained intercession

### 22.1 Introspection targets

The initial metaobject model can expose:

- types and representations;
- fields and variants;
- traits and associated items;
- implementations and predicates;
- generic parameters;
- functions and receivers;
- layout and ABI where available;
- attributes and visibility;
- source provenance where authorized.

### 22.2 Safe intercession boundary

Rust should permit intercession only through enumerated protocols whose output is ordinary compiler-checked Rust.

```rust
#[meta(protocol = SerializePolicy)]
struct Record { /* ... */ }

#[meta(protocol = RuntimePresentation)]
struct Light { /* ... */ }

#[meta(protocol = SchemaEvolution)]
struct Customer { /* ... */ }
```

Candidate protocols:

- serialization;
- validation;
- schema description and migration;
- editor presentation;
- RPC generation;
- persistence mapping;
- documentation;
- diagnostics;
- registration.

Do not permit metaobjects to redefine:

- borrow checking;
- lifetime validity;
- aliasing rules;
- drop order;
- object layout after layout calculation;
- trait coherence;
- method resolution;
- unsafe-code obligations.
---

## Navigation
[← Protocol Design](../05-metaobjects/protocol-design.md) | [Table of Contents](../SUMMARY.md) | [Intercession →](../05-metaobjects/intercession.md)
