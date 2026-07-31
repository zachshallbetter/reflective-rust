---
title: "Registry Strategies"
scope: "mid-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Registry Strategies under Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)."
---
# Registry Strategies

**Status:** Research synthesis

## 18. Registry strategies

| Strategy | Strengths | Weaknesses |
|---|---|---|
| Explicit application slice | portable, deterministic, `no_std` friendly | central list or generated manifest |
| Per-crate table and explicit merge | modular and deterministic | merge ceremony |
| Linker distributed slice | decentralized, no startup initializer | linker/platform complexity |
| Constructor inventory | low source ceremony | initialization and platform concerns |
| Compiler-native section | deduplication and integration | significant rustc/linker work |
| Dynamic plugin registration | separate loading | ABI/schema/version negotiation |

Recommended tiering:

```rust
pub struct Registry {
    types: &'static [&'static TypeInfo],
}

impl Registry {
    pub const fn from_static(types: &'static [&'static TypeInfo]) -> Self;
    pub fn from_linked_section() -> Result<Self, RegistryError>;
    pub fn merge(
        registries: impl IntoIterator<Item = &'static Registry>,
    ) -> Result<Self, RegistryError>;
}
```

The portable semantic core is explicit. `linkme` and `inventory` are useful prototype backends. A future compiler-native backend may aggregate and deduplicate reachable descriptors.
---

## Navigation
[← Invocation Adapters](../04-runtime/invocation.md) | [Table of Contents](../SUMMARY.md) | [Privacy Boundaries →](../04-runtime/privacy.md)
