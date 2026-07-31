---
title: "Minimal Proposed API"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Minimal Proposed API under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Minimal Proposed API

**Status:** Research synthesis

## Appendix B. Minimal proposed API surface

```rust
pub mod core::meta {
    #[consteval_only]
    pub struct Info { /* compiler owned */ }

    #[consteval_only]
    pub struct TypingEnv { /* compiler owned */ }

    #[consteval_only]
    pub struct AccessContext { /* compiler owned */ }

    pub enum Query<T> {
        Known(T),
        Unavailable(Requirement),
        Ambiguous(Ambiguity),
        Error(MetaError),
    }

    pub const fn of<T: ?Sized>() -> Info;
    pub const fn kind_of(info: Info) -> Kind;
    pub const fn identifier_of(info: Info) -> Option<&'static str>;
    pub const fn parent_of(info: Info) -> Option<Info>;
    pub const fn fields_of(info: Info) -> Query<MetaSlice<Info>>;
    pub const fn variants_of(info: Info) -> Query<MetaSlice<Info>>;
    pub const fn associated_items_of(info: Info) -> Query<MetaSlice<Info>>;
    pub const fn type_of(info: Info) -> Query<Info>;
    pub const fn normalize(info: Info, env: TypingEnv) -> Query<Info>;
    pub const fn prove(predicate: Info, env: TypingEnv) -> Query<GoalResult>;
    pub const fn selected_impl(trait_ref: Info, env: TypingEnv) -> Query<Info>;
    pub const fn layout_of(info: Info) -> Query<Layout>;
    pub const fn current_access() -> AccessContext;
    pub const fn visible_fields_of(
        info: Info,
        access: AccessContext,
    ) -> Query<MetaSlice<Info>>;
}
```
---

## Navigation
[← 08 Reference & Scaffolding](../08-reference/README.md) | [Table of Contents](../SUMMARY.md) | [Code Examples →](../08-reference/examples.md)
