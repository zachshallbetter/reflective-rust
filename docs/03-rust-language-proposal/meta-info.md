---
title: "Opaque `meta::Info`"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Opaque `meta::Info` under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Opaque `meta::Info`

**Status:** Research synthesis

## 7. `core::meta`: compiler-owned semantic reflection

### 7.1 Core abstraction

Rust should expose one opaque semantic handle:

```rust
pub mod core::meta {
    #[lang = "meta_info"]
    #[consteval_only]
    pub struct Info {
        _compiler_owned: (),
    }
}
```

`Info` is:

- non-forgeable;
- compiler-created;
- legal only during compile-time-only evaluation;
- equality-comparable within a compilation;
- not assigned a stable public numeric encoding;
- independent of rustc's internal representation.

### 7.2 Semantic kinds

```rust
#[non_exhaustive]
pub enum Kind {
    Crate,
    Module,
    Type,
    Struct,
    Enum,
    Union,
    Field,
    Variant,
    Trait,
    Impl,
    AssociatedType,
    AssociatedConst,
    Function,
    Method,
    Parameter,
    GenericParameter,
    ConstValue,
    Static,
    Closure,
    Coroutine,
    Instance,
}
```

### 7.3 Basic API

```rust
#[compile_time_only]
pub const fn of<T: ?Sized>() -> Info;

#[compile_time_only]
pub const fn kind_of(entity: Info) -> Kind;

#[compile_time_only]
pub const fn identifier_of(entity: Info) -> Option<&'static str>;

#[compile_time_only]
pub const fn parent_of(entity: Info) -> Option<Info>;

#[compile_time_only]
pub const fn type_of(entity: Info) -> Query<Info>;

#[compile_time_only]
pub const fn fields_of(ty: Info) -> Query<MetaSlice<Info>>;

#[compile_time_only]
pub const fn variants_of(ty: Info) -> Query<MetaSlice<Info>>;

#[compile_time_only]
pub const fn associated_items_of(entity: Info)
    -> Query<MetaSlice<Info>>;
```

### 7.4 Identity versus equivalence

Rust needs separate operations for declaration identity, type equality, and alias normalization.

```rust
### 7.5 Default Trait Method Bounds (`Sized` Requirement)

Static reflection traits providing default helper implementations (such as `csg_node()`) MUST explicitly bound `where Self: Sized` when evaluating memory properties:

```rust
pub trait MetaInfo {
    fn type_name() -> &'static str;
    fn domain_category() -> &'static str;
    fn db_table() -> Option<&'static str>;
    fn field_meta() -> Vec<FieldMeta>;

    /// Generates compiler semantic graph node with exact byte size.
    fn csg_node() -> CSGNode where Self: Sized {
        let fields = Self::field_meta();
        CSGNode {
            type_name: Self::type_name(),
            domain_category: Self::domain_category(),
            byte_size: std::mem::size_of::<Self>(),
            field_count: fields.len(),
            fields,
            db_table: Self::db_table(),
        }
    }
}
```

Without `where Self: Sized`, compiler static size evaluation (`std::mem::size_of::<Self>()`) yields `E0277: the size for values of type Self cannot be known at compilation time`.
---

## Navigation
[← Generation](../03-rust-language-proposal/generation.md) | [Table of Contents](../SUMMARY.md) | [Proposed Syntax →](../03-rust-language-proposal/proposed-syntax.md)
