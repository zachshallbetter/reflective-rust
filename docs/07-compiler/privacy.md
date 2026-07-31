---
title: "Privacy and Access Context"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Privacy and Access Context under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Privacy and Access Context

**Status:** Research synthesis

## 19. Privacy and cross-crate access

### 19.1 Filter before handle creation

Privacy is not only about whether a reflected field can later be accessed. Names, types, counts, attributes, offsets, and source locations can themselves reveal private representation. Inaccessible entities must be filtered before handles are returned.

### 19.2 Access contexts

```rust
#[consteval_only]
pub struct AccessContext {
    _compiler_owned: (),
}

pub const fn current_access() -> AccessContext;

pub const fn visible_fields_of(
    ty: Info,
    access: AccessContext,
) -> Query<MetaSlice<Info>>;
```

The compiler creates non-forgeable access contexts from lexical scope.

### 19.3 Owner-site authorization

The strongest rule is owner-site projection:

```rust
mod model {
    pub struct SecretRecord {
        public_id: u64,
        secret: SecretMaterial,
    }

    pub const RUNTIME_VIEW: &'static TypeInfo = const {
        reflect_runtime::project::<SecretRecord>(
            ProjectionPolicy::fields(["public_id"])
        )
    };
}
```

The external library supplies the algorithm. Private authority comes from the owner's lexical const block. The public artifact contains only the approved view.

### 19.4 Cross-crate metadata rule

Export:

```text
public and effectively reachable entities
+ explicitly exported reflection contracts
+ opaque invalidation hashes
```

Do not export:

```text
private field names
private field types
private member counts
private source locations
private attributes
private generated accessors
```
---

## Navigation
[← Coherence](../07-compiler/coherence.md) | [Table of Contents](../SUMMARY.md) | [Optimization Boundaries →](../07-compiler/optimization.md)
