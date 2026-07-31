---
title: "Semantic Reflection"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Semantic Reflection under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Semantic Reflection

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
pub const fn same_entity(a: Info, b: Info) -> bool;
pub const fn same_type(a: Info, b: Info) -> Query<bool>;
pub const fn dealias(ty: Info) -> Query<Info>;
```

An `Info` for `Vec<T>` is not an `Info` for `Vec<u32>`. A generic declaration is not a concrete codegen instance. A type alias may have declaration identity distinct from its normalized target.
---

## Navigation
[← 03 Rust Language Proposal](../03-rust-language-proposal/README.md) | [Table of Contents](../SUMMARY.md) | [Compile-Time Execution →](../03-rust-language-proposal/compile-time-execution.md)
