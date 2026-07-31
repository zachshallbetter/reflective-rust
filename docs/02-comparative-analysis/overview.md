---
title: "Comparative Findings"
scope: "context"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Comparative Findings under Historical Evidence & Comparative Context."
---
# Comparative Findings

**Status:** Research synthesis

## 4. Comparative findings

### 4.1 C++ P2996

P2996 demonstrates a mature design pattern:

- one opaque `std::meta::info` type;
- compiler-created values representing semantic entities;
- consteval-only query functions;
- reflection after semantic interpretation rather than token parsing;
- splicing of reflected entities back into grammatical positions;
- explicit handling of access and layout questions.

The transferable lesson is not the exact syntax. It is the separation between a compiler-owned semantic identity and ordinary runtime objects.

### 4.2 CallMeMaybe

CallMeMaybe demonstrates the static-to-runtime bridge:

```text
P2996 reflection
    -> compile-time traversal
    -> generated runtime IDs and descriptors
    -> generated constructors/accessors/invocation thunks
    -> runtime registry and dynamic calls
```

Its value is architectural. It proves that runtime reflection can be generated from authoritative static reflection. Its experimental ownership, access, and hashing choices should not be copied directly into safe Rust.

### 4.3 Rust procedural macros

Rust procedural macros transform token streams. They can parse declarations and generate syntax, but they do not authoritatively know:

- resolved type identity;
- selected trait candidates;
- normalized associated types;
- inferred substitutions;
- final layout;
- cross-crate semantic identity;
- body-level coercions or borrow state.

They are suitable for prototyping the runtime ABI and user workflows, not for implementing native semantic reflection.

### 4.4 Rust reflection/comptime initiative

Rust's emerging project work supports the direction of compile-time-only type information through const evaluation. Its currently stated scope is narrower than this report: it focuses on producing compile-time values and preserving privacy, while reification and item generation remain further design work.

### 4.5 CLOS MOP

CLOS demonstrates the power of metaobject protocols to expose and customize object-system behavior: class construction, slot access, method dispatch, generic functions, and inheritance. Rust can transfer the distinction between introspection and intercession, but cannot safely expose unrestricted modification of ownership, lifetime validity, layout, coherence, or drop semantics.

### 4.6 Smith's procedural reflection

Smith's 3-LISP establishes a stronger criterion than runtime metadata. A reflective process must:

1. obtain articulated descriptions of active processor state;
2. inspect or modify those descriptions;
3. resume computation according to the possibly modified state;
4. permit reflection on reflective procedures themselves.

The reflected model is causally connected to the processor. A debugger, stack trace, runtime type registry, or source map alone does not satisfy this definition.

### 4.7 Other languages

D, Zig, Nim, Julia, Smalltalk, Java, and C# supply useful comparisons:

- **D:** broad compile-time semantic queries, but with different module and safety constraints.
- **Zig:** compiler-integrated type information and compile-time execution, demonstrating the productivity of one language across stages.
- **Nim:** powerful syntax-level AST macros, closer to procedural macro transformation than post-semantic reflection.
- **Julia:** expression-level metaprogramming and generated functions, with dynamic dispatch and world-age constraints unlike Rust.
- **Smalltalk:** live image, first-class classes/methods, and reflective development environment.
- **Java/C#:** strong runtime metadata and dynamic invocation, but with runtime metadata costs and a different object model.

The comparison supports a hybrid Rust design: semantic compile-time authority, optional runtime projection, and explicit live-execution domains.
---

## Navigation
[← 02 Comparative Analysis](../02-comparative-analysis/README.md) | [Table of Contents](../SUMMARY.md) | [C++ P2996 →](../02-comparative-analysis/cpp-p2996.md)
