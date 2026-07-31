---
title: "A Rust-Native Architecture for Semantic Reflection, Consteval Metaprogramming, Runtime Projection, and Procedural Reflection"
scope: "context"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for A Rust-Native Architecture for Semantic Reflection, Consteval Metaprogramming, Runtime Projection, and Procedural Reflection under Historical Evidence & Comparative Context."
---
# A Rust-Native Architecture for Semantic Reflection, Consteval Metaprogramming, Runtime Projection, and Procedural Reflection

**Deep research report**  
**Version:** 1.0  
**Date:** 2026-07-30

---

## Abstract

Rust can support semantic static reflection, compile-time metaprogramming, generated runtime reflection, metaobject introspection, constrained intercession, and limited procedural reflection without abandoning its safety, coherence, privacy, incremental-compilation, or zero-cost principles. It can do so only if these facilities are separated by compiler phase and authority.

The recommended architecture has four layers. First, semantic static reflection exposes compiler-resolved entities through an opaque, compiler-owned, compile-time-only `meta::Info`. Second, consteval metaprogramming executes deterministic Rust over those handles with explicit resource budgets and tracked dependencies. Third, runtime projection generates only requested descriptors and checked adapters; compiler reflection handles never survive into ordinary runtime memory. Fourth, procedural reflection operates only inside explicitly reflectable execution domains whose frames, suspension points, continuations, and mutation capabilities were designed for reflection.

This design synthesizes the strongest transferable ideas from C++ P2996 and `std::meta::info`, experimental Clang implementations, CallMeMaybe's static-to-runtime projection, Rust's current reflection/comptime initiative, Brian Cantwell Smith's 3-LISP model of causally connected procedural reflection, the CLOS Metaobject Protocol, and modern reflective or metaprogrammable languages. It rejects direct exposure of rustc internals, unrestricted private-member discovery, unbounded fixed-point generation, privileged generated implementations, unsafe type erasure disguised as reflection, and arbitrary continuation mutation.

---

## Executive decision

Rust should adopt a **staged reflective architecture**, not a single unrestricted reflection API.

1. **Semantic static reflection:** opaque consteval-only compiler handles.
2. **Consteval metaprogramming:** deterministic, tracked, resource-bounded compile-time Rust.
3. **Runtime projection:** opt-in descriptors, registries, accessors, and checked invocation adapters.
4. **Procedural reflection:** separate, explicit execution domains with compiler-certified safepoints.

The central design rule is:

```text
compiler semantic facts
    -> opaque compile-time handles
    -> deterministic consteval computation
    -> typed reification into ordinary Rust
    -> ordinary privacy, coherence, borrow, and unsafe checks
    -> optional runtime projection
```

Procedural reflection forms a separate branch:

```text
explicitly reflectable computation
    -> retained or interpreted processor state
    -> typed environment and frame views
    -> capability-limited state changes
    -> compiler-certified resumption
```

---

## 1. Research question and scope

### 1.1 Canonical research question

How can Rust support semantic static reflection, compile-time metaprogram execution, generated runtime introspection, metaobject introspection/intercession, and procedural reflection without weakening soundness, coherence, predictable compilation, privacy, incremental compilation, or zero-cost-by-default?

### 1.2 Included facilities

This report covers:

- semantic reflection after name resolution and type analysis;
- contextual trait and normalization queries;
- compile-time-only evaluation over reflected entities;
- typed reification and declaration generation;
- opt-in runtime type descriptors and dynamic invocation;
- registry construction and linker integration;
- privacy and cross-crate access control;
- generated-implementation coherence;
- diagnostics and incremental compilation;
- metaobject introspection and constrained intercession;
- procedural reflection over active computation;
- implementation sequencing and evaluation.

### 1.3 Excluded claims

This report does not claim that:

- procedural macros already provide semantic reflection;
- all compiler facts exist at one universal post-analysis point;
- runtime reflection follows automatically from static reflection;
- full 3-LISP-equivalent reflection is feasible over arbitrary optimized native Rust;
- an unrestricted CLOS-style MOP is compatible with Rust's safety model;
- the proposed surface syntax has been accepted by the Rust project.

---

## 2. Evidence status and methodology

### 2.1 Evidence categories

| Status | Meaning |
|---|---|
| **Established** | Documented behavior of current Rust, P2996, or demonstrated repository behavior. |
| **Emerging** | Active but unstable Rust reflection/comptime work. |
| **Author inference** | Architecture derived from established constraints but not yet implemented. |
| **Recommendation** | A design choice among feasible alternatives. |

### 2.2 Primary evidence base

The principal sources are:

- C++ P2996R13, including the opaque `std::meta::info` model and splicing;
- related C++ reflection papers on access contexts, hashing, and runtime projection;
- the Rust Reference and rustc development guide;
- Rust's 2026 reflection and comptime project goal;
- CallMeMaybe and its examples;
- Brian Cantwell Smith, *Procedural Reflection in Programming Languages*;
- CLOS MOP literature and established reflective-language practice;
- practical registry crates such as `linkme` and `inventory`.

### 2.3 Governing methodological rules

The research follows the uploaded priming procedure: source-derived observations remain separate from design inferences; missing semantic information is represented as unavailable or ambiguous rather than false; implementation proposals are not presented as existing behavior; terminology is canonical and stable; limitations and threats are explicit.

---

## 3. Canonical ontology

| Construct | Canonical definition | Excluded adjacent construct |
|---|---|---|
| **Syntax metaprogramming** | Transformation of tokens or parsed syntax before complete semantic analysis. | Does not imply resolved type or trait knowledge. |
| **Semantic static reflection** | Compile-time access to compiler-resolved program entities and properties. | Not a proc macro's parsed representation. |
| **Reflection handle** | Opaque compile-time identity for a semantic entity. | Not a public wrapper around `DefId`, HIR, THIR, MIR, or `Ty<'tcx>`. |
| **Consteval metaprogram** | Rust code required to execute during compilation and permitted to manipulate reflection handles. | Not an ordinary function that may execute at runtime. |
| **Reification** | Conversion of a reflected semantic entity into a grammatical Rust role. | Not string-based code generation. |
| **Generation** | Materialization of new Rust entities from compile-time computation. | Not mutation of already analyzed compiler state. |
| **Runtime projection** | Descriptors and adapters intentionally emitted from static semantic knowledge. | Not retention of compiler reflection handles. |
| **Metaobject introspection** | Inspection of structures governing types, traits, implementations, and operations. | Does not necessarily modify those structures. |
| **Constrained intercession** | Participation in an enumerated protocol whose result remains ordinary compiler-checked Rust. | Not replacement of borrow checking or coherence. |
| **Procedural reflection** | Causally connected access to an active computation's environment, continuation, and state. | Not ordinary runtime type reflection. |
| **Reflectable execution domain** | An execution regime deliberately compiled or interpreted so that certified processor state can be inspected and resumed. | Not arbitrary optimized native execution. |
| **Causal connection** | A guarantee that reflected state describes and can consequentially affect the computation it represents. | Not debug metadata that merely resembles source state. |

---

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

## 5. Non-negotiable invariants

1. **No semantic query before its prerequisites.** Queries report explicit unavailability or ambiguity.
2. **No public compiler-internal ABI.** Reflection handles cannot expose rustc lifetimes or internal node layouts.
3. **No ambient compile-time authority.** Consteval metaprograms cannot access arbitrary files, networks, clocks, or processes.
4. **No private-structure discovery by default.** Inaccessible entities are filtered before handles are created.
5. **No coherence exception for generated code.** Generated implementations pass ordinary orphan and overlap checks.
6. **No backward semantic influence.** A metaprogram cannot change the semantic snapshot it observed.
7. **No raw erased call through safe APIs.** Dynamic invocation validates type, receiver, mutability, ownership, and supported lifetime relationships.
8. **No runtime metadata tax without request.** Compiler metadata disappears unless projected.
9. **No arbitrary continuation mutation.** Procedural intercession is limited to certified transitions.
10. **No false equivalence between layout and API.** Layout reflection is target/build specific unless representation guarantees say otherwise.

---

## 6. Compiler phases and query availability

Rust has no single point where every semantic fact is final. Reflection queries must state their prerequisites.

| Semantic stratum | Compiler knowledge | Candidate queries | Required failure states |
|---|---|---|---|
| **Expanded** | Items and attributes after ordinary macro expansion | syntax origin, raw declared attributes | expansion incomplete |
| **Resolved** | Definitions, namespaces, paths, parent relationships, visibility | kind, identity, parent, fields, variants | unresolved, inaccessible, incomplete |
| **Item-typed** | Resolved signatures, generics, predicates, field types | `type_of`, `signature_of`, `predicates_of` | type collection error, opaque component |
| **Body-typed** | Inferred local/expression types, method candidates, coercions | local type, call resolution, coercion | body not checked, inference incomplete |
| **Normalized** | Contextual normalization and trait goals | normalize, prove, selected candidate | ambiguous, overflow, no solution, cycle |
| **Layout-known** | Size, alignment, ABI class, offsets for concrete target/type | layout, field layout | generic, unsized, opaque, target absent |
| **Monomorphized** | Concrete instances and codegen-selected calls | instance, selected impl, concrete ABI | no reachable instance, still polymorphic |

### 6.1 Query result algebra

Missing information must not become `false`, an empty list, zero, or null.

```rust
pub enum Query<T> {
    Known(T),
    Unavailable(Requirement),
    Ambiguous(Ambiguity),
    Error(MetaError),
}

pub enum Requirement {
    CompleteDefinition,
    BodyTypeChecked,
    ConcreteSubstitutions,
    SizedType,
    TargetLayout,
    MonomorphizedInstance,
    OwnerAuthorization,
}

pub enum Ambiguity {
    InferenceVariable,
    MultipleTraitCandidates,
    UnnormalizedAlias,
    OpaqueType,
    SolverCycle,
}
```

`Unavailable` means the fact cannot yet or generally exist. `Ambiguous` means the semantic question is valid but lacks a unique answer under the supplied environment.

---

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

## 8. Contextual trait solving and normalization

A global `implements<Trait>() -> bool` is semantically inadequate. Results depend on generic assumptions, solver state, opaque types, normalization, and concrete substitutions.

```rust
#[consteval_only]
pub struct TypingEnv {
    _compiler_owned: (),
}

pub enum GoalResult {
    Proven,
    Disproven,
    Ambiguous(Ambiguity),
}

pub const fn current_typing_env() -> TypingEnv;

pub const fn prove(
    predicate: Info,
    env: TypingEnv,
) -> Query<GoalResult>;

pub const fn normalize(
    ty: Info,
    env: TypingEnv,
) -> Query<Info>;

pub const fn selected_impl(
    trait_ref: Info,
    env: TypingEnv,
) -> Query<Info>;
```

For a generic function constrained by `T: Trait`, the valid result may be "proved through an obligation" rather than a concrete implementation identity. Concrete implementation identity belongs to a monomorphized query.

---

## 9. Layout and monomorphization

Rust's default layout is not a stable cross-build schema. Layout reflection must be target-specific and available only for concrete, layout-known types.

```rust
pub struct Layout {
    pub size: u64,
    pub align: u64,
    pub abi: AbiClass,
    pub fields: MetaSlice<FieldLayout>,
    pub target: TargetFingerprint,
    pub representation: Representation,
}

pub struct FieldLayout {
    pub field: Info,
    pub offset: u64,
    pub size: u64,
    pub align: u64,
}

pub const fn layout_of(ty: Info) -> Query<Layout>;
pub const fn instances_of(item: Info) -> Query<MetaSlice<Info>>;
```

Persistent formats, plugin ABIs, FFI, and network protocols still require explicit representation or schema contracts.

---

## 10. Consteval execution model

### 10.1 Compile-time-only functions

```rust
#[compile_time_only]
pub const fn describe<T: ?Sized>() -> StaticTypeDescription {
    let ty = meta::of::<T>();
    build_description(ty)
}
```

| Property | Ordinary `const fn` | Compile-time-only `const fn` |
|---|---|---|
| Runtime call | permitted | rejected |
| `meta::Info` parameters/results | rejected | permitted |
| Required execution | only in const context | always |
| Host I/O | unavailable | unavailable |
| Semantic compiler queries | unavailable | available through tracked intrinsics |
| Runtime code for metaprogram | possible | none |

### 10.2 Determinism

A metaprogram is a pure compiler query from declared inputs to a value or generated fragment. Its fingerprint includes:

```text
metaprogram MIR
+ constant arguments
+ reflected entity fingerprints
+ access context
+ typing environment
+ target and data layout
+ crate features and cfg
+ language/compiler feature version
+ explicitly tracked external inputs
```

Ambient file reads, environment variables, current time, randomness, networking, and process execution are unavailable.

### 10.3 Tracked external inputs

Where external data is required, it enters through explicit tracked APIs:

```rust
pub const fn include_tracked(path: &TrackedPath) -> TrackedBytes;
```

The path identity and content hash become incremental dependencies.

### 10.4 Resource accounting

| Resource | Accounting unit | Diagnostic requirement |
|---|---|---|
| Execution | MIR interpreter steps | show call stack and largest consumers |
| Memory | peak consteval allocation | show allocation site and retained object |
| Reflection | semantic query count | show repeated query and entity |
| Recursion | metaprogram call depth | show cycle or deepest chain |
| Generation | number and size of emitted entities | show generator and output category |
| Solver work | goals and recursion | distinguish ambiguity from budget exhaustion |

Limits are reproducible compilation inputs. Raising a limit permits completion; it must not alter a successful semantic result.

---

## 11. Hygiene and typed reification

### 11.1 Why raw token generation is insufficient

Raw tokens repeat parsing, weaken hygiene, delay errors, and permit accidental capture. Native semantic reflection should preserve semantic identity through typed splicing.

### 11.2 Typed splice categories

```rust
pub mod core::meta::splice {
    pub const fn ty(info: Info) -> TypeFragment;
    pub const fn expr(info: Info) -> ExprFragment;
    pub const fn path(info: Info) -> PathFragment;
    pub const fn pattern(info: Info) -> PatternFragment;
    pub const fn item(info: Info) -> ItemFragment;
    pub const fn attribute(info: Info) -> AttributeFragment;
    pub const fn impl_target(info: Info) -> ImplTargetFragment;
}
```

A type splice cannot silently become an expression. A member splice cannot bypass privacy. An item fragment is validated semantic output, not unscoped text.

### 11.3 Recommended generation interface

Use a hybrid:

- typed quotation for source-shaped generated code;
- semantic builders for mechanically generated schemas or large declaration sets.

```rust
#[compile_time_only]
const fn make_serializer(ty: meta::Info) -> meta::ItemFragment {
    let helper = meta::fresh_ident("serialize_field");

    meta::quote_item! {
        fn $helper(...) {
            // generated body
        }
    }
}
```

Spliced entities retain original semantic identity. Fresh names use compiler-generated identities. Definition-site names resolve consistently.

---

## 12. Generation staging and semantic cycles

### 12.1 The cycle problem

```rust
if !meta::prove(meta::trait_ref::<T, Serialize>())? {
    meta::emit_item(/* impl Serialize for T */);
}
```

If emitted declarations are visible immediately, the output changes the query that produced it.

### 12.2 Frozen snapshot model

The initial language should use one-way materialization:

```text
A. parse and expand ordinary macros
B. resolve and type reflection inputs
C. freeze semantic snapshot S0
D. execute metaprograms against S0
E. produce typed fragments G0
F. materialize S1 = S0 + G0
G. resolve, type-check, and coherence-check S1
H. continue to MIR and code generation
```

Generated entities are not visible to their producer.

### 12.3 Fixed-point generation

Automatic fixed-point iteration is excluded from the initial design because it complicates:

- termination;
- coherence;
- diagnostic causality;
- incremental dependency graphs;
- deterministic ordering;
- semantic versioning.

Explicit later stages may be researched separately, each observing a frozen prior stage.

---

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

## 14. Rustc integration architecture

| Compiler subsystem | Responsibility |
|---|---|
| `rustc_expand` | preserve hygiene/source provenance; materialize generated fragments |
| `rustc_resolve` | semantic identity, namespaces, access contexts |
| HIR collection | item shape, generics, signatures, declared attributes |
| body type checking | inferred local types, method resolution, coercions |
| trait solver | contextual proof, normalization, ambiguity-preserving results |
| `rustc_middle::ty` | internal identity and substitutions behind `Info` |
| CTFE interpreter | compile-time-only execution and reflection intrinsics |
| query system | incremental dependency tracking and caching |
| privacy checker | filter reflected entities and validate private projections |
| coherence checker | validate generated implementations |
| MIR construction | lower generated code and future reflectable-domain transforms |
| monomorphization collector | identify concrete reflection adapters and instances |
| metadata encoder | export only permitted semantic data across crates |
| codegen/linker | emit, deduplicate, retain, and strip runtime descriptors |
| diagnostics | retain source invocation, generator, reflected entity, and generated span |

The public API must not freeze HIR, THIR, MIR, `DefId`, `Ty<'tcx>`, solver goals, or backend `Instance` structures into the language.

---

## 15. Runtime projection model

### 15.1 Principle

`meta::Info` never survives into ordinary runtime memory. A compiler or metaprogram emits only the requested projection.

### 15.2 Descriptor model

```rust
pub mod reflect_runtime {
    #[repr(transparent)]
    #[derive(Clone, Copy, Eq, PartialEq, Hash)]
    pub struct TypeKey([u8; 16]);

    pub struct TypeInfo {
        pub key: TypeKey,
        pub name: &'static str,
        pub kind: TypeKind,
        pub size: Option<usize>,
        pub align: Option<usize>,
        pub fields: &'static [FieldInfo],
        pub methods: &'static [MethodInfo],
        pub constructors: &'static [ConstructorInfo],
        pub capabilities: TypeCapabilities,
        pub schema_version: Option<u64>,
    }

    pub struct FieldInfo {
        pub name: &'static str,
        pub ty: fn() -> &'static TypeInfo,
        pub capabilities: FieldCapabilities,
        pub shared_get: Option<SharedGetter>,
        pub mutable_get: Option<MutableGetter>,
        pub set_owned: Option<OwnedSetter>,
        pub attributes: &'static [RuntimeAttribute],
    }

    pub struct MethodInfo {
        pub name: &'static str,
        pub receiver: ReceiverKind,
        pub parameters: &'static [ParameterInfo],
        pub return_type: fn() -> &'static TypeInfo,
        pub effects: MethodEffects,
        pub capabilities: MethodCapabilities,
        pub invoke: InvokeAdapter,
    }
}
```

### 15.3 Runtime identity classes

| Key class | Stability | Use |
|---|---|---|
| Process-local | one execution | fast registry lookup |
| Build-local | one linked artifact | descriptor deduplication |
| Schema key | across explicitly compatible releases | persistence and RPC negotiation |
| Human name | no uniqueness guarantee | display and diagnostics |

Names, compiler IDs, addresses, and schema IDs must not be conflated.

---

## 16. Safe erased values and invocation

### 16.1 Sealed erased references

Safe runtime reflection must not accept arbitrary raw pointers paired with claimed type IDs.

```rust
pub struct DynRef<'a> {
    ptr: core::ptr::NonNull<()>,
    ty: TypeKey,
    provenance: ProvenanceToken<'a>,
}

pub struct DynMut<'a> {
    ptr: core::ptr::NonNull<()>,
    ty: TypeKey,
    provenance: ExclusiveToken<'a>,
}

pub struct OwnedValue {
    storage: OwnedStorage,
    ty: TypeKey,
    drop_fn: unsafe fn(*mut ()),
}
```

Fields are private. Only generated projection code and audited runtime internals can construct these values. `DynMut` is non-cloneable and represents exclusive authority.

### 16.2 Adapter strategies

| Adapter | Borrowed values | Cost | Complexity | Recommended use |
|---|---:|---:|---:|---|
| Owned value vector | copied/owned only | allocation and conversion | low | MVP, RPC, scripting |
| Borrow-aware call frame | supported relationships | low-moderate | high | editors, in-process reflection |
| Typed method handle | fully static after lookup | near direct call | medium | repeated performance-sensitive calls |

### 16.3 Safe facade sequence

```text
lookup method
-> verify invoke capability
-> verify receiver kind and TypeKey
-> verify shared/exclusive authority
-> verify argument count and TypeKeys
-> verify supported ownership/lifetime mode
-> call generated thunk
-> wrap return with generated provenance
```

Unsupported borrowed signatures, higher-ranked relationships, variadics, unsafe preconditions, or unsized values are rejected unless the runtime ABI explicitly supports them.

---

## 17. Capability-based runtime access

Discoverability is not authority.

```rust
bitflags! {
    pub struct TypeCapabilities: u32 {
        const DISCOVER  = 1 << 0;
        const CONSTRUCT = 1 << 1;
        const CLONE     = 1 << 2;
        const SERIALIZE = 1 << 3;
        const OBSERVE   = 1 << 4;
    }

    pub struct FieldCapabilities: u32 {
        const READ_SHARED     = 1 << 0;
        const WRITE_EXCLUSIVE = 1 << 1;
        const SET_OWNED       = 1 << 2;
        const OBSERVE         = 1 << 3;
    }

    pub struct MethodCapabilities: u32 {
        const INVOKE = 1 << 0;
        const RPC    = 1 << 1;
        const EDITOR = 1 << 2;
    }
}
```

A downstream crate cannot grant itself access to a private field. The compiler emits private accessors only inside an authenticated owner context, and the owner explicitly chooses what to export.

```rust
#[reflect_runtime(
    type(discover, construct),
    fields(public = "read", marked = "read,write"),
    methods(marked = "invoke")
)]
pub struct Light {
    #[reflect(editor, range = 0.0..=100_000.0)]
    intensity: f32,

    #[reflect(editor)]
    color: Color,

    cache: InternalCache,
}
```

`cache` is absent from the public projection.

---

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

## 21. Diagnostics

Reflection diagnostics need to preserve:

- source invocation;
- metaprogram call stack;
- reflected entity;
- query prerequisite;
- access context;
- generated fragment and virtual source span.

Examples:

```text
error[E-META-LAYOUT]: layout is not available for a polymorphic type
  --> src/schema.rs:42:18
   = reflected type: `T`
   = requirement not met: concrete substitutions and target-known `Sized`
   = help: move the query to a monomorphized projection
```

```text
error[E-META-PRIVATE]: reflected member is not accessible
  --> src/editor.rs:11:25
   = member: private field of `model::Account`
   = projection site: crate `editor_support`
   = help: define the projection in `model` or explicitly export the member
```

```text
error[E-META-CYCLE]: semantic generation depends on its own output
  --> src/derive.rs:27:1
   = query: whether `T: Encode`
   = generated output: `impl Encode for T`
   = note: generated declarations are not visible in their producing snapshot
```

```text
error[E-META-BUDGET]: compile-time metaprogram exceeded its query budget
  --> src/registry.rs:8:1
   = repeated query: `associated_items_of(core::iter::Iterator)`
```

---

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

## 23. Procedural reflection

### 23.1 Why arbitrary native execution is insufficient

Optimized Rust may inline functions, eliminate locals, transform control flow, specialize generics, reorder operations, and erase a source-level environment/continuation representation. Ordinary binaries do not retain an editable MIR processor state.

Full procedural reflection therefore requires an execution regime intentionally designed to preserve causally connected state.

### 23.2 Reflectable execution domain

```rust
pub mod process_meta {
    pub struct Domain<P> { _private: P }
    pub struct Paused<'domain> { _exclusive_pause: &'domain mut () }
    pub struct Frame<'pause> { _private: &'pause () }
    pub struct ResumeToken { _compiler_owned: () }

    pub enum Capability {
        InspectFrames,
        ReadLocals,
        WriteCertifiedLocals,
        Resume,
        Abort,
        InstallEffectHandler,
    }

    pub fn spawn<F>(future: F, policy: DomainPolicy) -> Domain<F>
    where
        F: ReflectableFuture;
}
```

A domain is not a debugger back door into an arbitrary thread. Its code is compiled or interpreted with explicit state representation, safepoints, provenance, and capabilities.

### 23.3 Backend comparison

| Design | Causal fidelity | Runtime overhead | Local inspection | Resumption | Limitation |
|---|---:|---:|---:|---|---|
| MIR interpreter | high | high | strongest | interpreter continuation | separate, slower regime |
| Resumable MIR transformation | high at safepoints | moderate | strong | state-machine edges | major compiler work |
| Instrumented async/coroutine | moderate-high at suspension | low-moderate | retained locals | existing poll/resume | cooperative points only |
| Native stack + debug info | low | low inactive cost | unreliable | debugger-specific | not language-level reflection |
| Whole-process VM | high | high | strong | VM continuation | changes deployment model |

### 23.4 Recommended progression

1. **MVP:** annotated async functions/coroutines at `.await`, `yield`, or explicit `reflect_point!()` safepoints.
2. **Research backend:** selected execution under a MIR interpreter.
3. **Advanced backend:** resumable MIR transformation for annotated synchronous functions.

### 23.5 Certified local mutation

A reflected local cannot be a general `&mut dyn Any`. Its legality depends on borrow state, pinning, drop flags, initialization, and future uses.

```rust
pub enum LocalAccess {
    ReadOnly,
    ReplaceSameType,
    UpdateThroughOwnerProtocol,
    Opaque,
}
```

Mutation is allowed only for compiler-certified replaceable slots. It is forbidden where replacement could invalidate a reference, violate pinning, corrupt partially initialized state, alter a discriminant inconsistently, or bypass an unsafe invariant.

### 23.6 Certified continuation redirection

Safe procedural reflection may choose only compiler-generated legal successors.

```rust
pub struct ResumePoint {
    pub id: ResumePointId,
    pub required_state: StatePredicate,
    pub effects: EffectSummary,
}
```

No safe API constructs arbitrary instruction pointers or skips required drops.

---

## 24. Threat model

| Threat | Mechanism | Mitigation |
|---|---|---|
| Wrong-type erased invocation | raw pointer paired with false type claim | sealed erased references, generated keys, checked facade |
| Aliasing violation | simultaneous mutable/shared reflection | exclusive capability tokens tied to borrows |
| Invalid borrowed return | result outlives receiver/argument | borrow-aware ABI or reject signature |
| Double drop/leak | untracked dynamic allocation | `OwnedValue` with generated drop glue |
| Private leak | names/types/counts exposed | filter before handle creation; owner projection |
| Coherence bypass | generated foreign or overlapping impl | ordinary orphan/overlap checks |
| Semantic cycle | output changes producing query | frozen snapshot |
| Compile-time denial of service | unbounded recursion/solver/output | deterministic budgets |
| Nondeterministic build | ambient host state | no ambient access; tracked inputs; canonical ordering |
| Stale incremental result | hidden dependency omitted | all intrinsics are tracked compiler queries |
| Layout misuse | build-specific offsets treated as ABI | explicit target/build marker and representation contract |
| Metadata bloat | global retention | opt-in projection and reachability stripping |
| Registry stripping | linker removes descriptors | defined retention semantics and platform tests |
| Registry collision | name or weak hash as identity | separate process/build/schema keys |
| Capability escalation | downstream fabricates write/invoke | non-forgeable generated capabilities |
| Unsafe dynamic method | hidden preconditions | explicit unsafe invocation authority |
| Invalid procedural state | inconsistent local/borrow/continuation mutation | certified safepoints and typed transitions |

---

## 25. Zero-cost criterion

"Zero cost" means:

1. A program that does not use reflection emits no reflection metadata or registry machinery.
2. Compile-time reflection handles and metaprogram code do not exist at runtime.
3. Static projections optimize like handwritten adapters.
4. Runtime descriptors and thunks are emitted only for requested, reachable capabilities.

Dynamic name lookup, descriptor traversal, type checks, and erased invocation necessarily cost time and space. Users pay those costs only when choosing the dynamic path.

---

## 26. Example workflows

### 26.1 Serialization

```rust
#[reflect_runtime(serializer = "fieldwise")]
pub struct Record {
    id: u64,
    name: String,

    #[reflect(skip)]
    cache: Cache,
}
```

Compile-time flow:

```text
owner-authorized semantic query
-> field policy evaluation
-> typed field walkers
-> static serializer descriptor
-> ordinary optimization
```

The runtime path may traverse descriptors. The static path may inline generated field access.

### 26.2 Editor generation

```rust
#[reflect_runtime(editor)]
pub struct Light {
    #[reflect(label = "Intensity", unit = "lm", range = 0.0..=100_000.0)]
    intensity: f32,

    #[reflect(label = "Color")]
    color: Color,
}
```

The projection generates labels, units, range metadata, shared getters, and exclusive setters. Raw offsets are unnecessary.

### 26.3 RPC

```rust
#[reflect_runtime(rpc)]
impl InventoryService {
    #[reflect(rpc, name = "inventory.get")]
    pub async fn get(
        &self,
        request: GetRequest,
    ) -> Result<GetResponse, ServiceError> {
        // ...
    }
}
```

The metaprogram checks supported ownership, schemas, `Send`/`Sync` policy, error mapping, and visibility, then generates dispatch and serialization adapters.

### 26.4 ECS

```rust
#[component]
pub struct Transform {
    translation: Vec3,
    rotation: Quat,
}
```

`#[component]` supplies domain intent. Reflection supplies field shape, drop/clone functions, editor projection, and registration metadata. Structural shape alone does not imply component semantics.

### 26.5 CallMeMaybe-style dynamic invocation

```text
meta::of::<Player>()
-> fields_of / associated_items_of
-> owner-authorized selection
-> TypeInfo and TypeKey
-> constructor/method thunks
-> registry
-> checked runtime lookup and invocation
```

Rust's version differs by representing ownership through `OwnedValue`, private access through owner authorization, and invocation through borrow/capability checks.

---

## 27. Prototype crate architecture

```text
reflect-runtime
|-  TypeInfo, FieldInfo, MethodInfo
|-  DynRef, DynMut, OwnedValue
|-  capability types
|-  safe invocation facade
`-  schema and error types

reflect-derive
|-  syntax-only descriptor generation
|-  generated getters and setters
|-  owned invocation thunks
`-  diagnostic experiments

reflect-registry
|-  explicit registry
|-  per-crate registry tables
|-  linkme backend
`-  inventory backend

reflect-workloads
|-  serialization
|-  editor generation
|-  RPC
|-  ECS registration
`-  dynamic invocation
```

`reflect-derive` is a validation vehicle, not semantic reflection. It validates the runtime ABI and workflows before compiler changes.

---

## 28. Phased implementation roadmap

| Milestone | Deliverable | Exit criterion |
|---|---|---|
| Runtime model prototype | descriptors, safe erased values, owned invocation, capabilities | Miri passes; safe API cannot fabricate wrong typed reference |
| Syntax projection prototype | derive-generated descriptors and thunks | validates runtime ABI; explicitly labeled syntax-based |
| Registry prototype | explicit, `linkme`, optional `inventory` backends | cross-platform LTO/dead-strip tests pass |
| Workload suite | serialization, editor, RPC, ECS, dynamic invocation | required semantic queries are enumerated |
| Read-only rustc reflection | experimental compiler-owned `Info` | privacy-filtered consteval-only queries work |
| Consteval integration | compile-time-only functions and budgets | reproducible execution and incremental invalidation |
| Contextual semantic queries | normalization, proof, layout, instances | ambiguity/unavailability represented explicitly |
| Runtime projector | compiler-supported descriptor emission | zero unused runtime cost |
| Typed reification | typed holes for type/path/expression/item/member | hygiene and ordinary diagnostics preserved |
| Staged generation | frozen snapshot and one-way materialization | same-stage cycles rejected deterministically |
| Owner-authorized private projection | lexical access context | negative privacy tests show no leakage |
| Borrow-aware invocation | generated call-frame ABI | Miri lifetime/alias tests pass |
| Procedural reflection MVP | instrumented async/coroutine domains | certified inspect/replace/resume only |
| MIR interpreter backend | articulated frames and continuations | causal inspection and controlled resumption demonstrated |
| Resumable MIR experiment | synchronous annotated state machines | borrow/drop invariants preserved |

---

## 29. Evaluation methodology

| Area | Tests | Success criterion |
|---|---|---|
| Semantic correctness | aliases, generics, associated types, opaque types, ambiguity | no silent collapse of ambiguity or unavailability |
| Phase discipline | premature layout/body/instance queries | deterministic phase-specific diagnostics |
| Privacy | module, sibling, dependency, re-export, owner projection | inaccessible entities produce no handles or metadata |
| Coherence | foreign/foreign, overlap, blanket, unsafe impls | same result as handwritten source |
| Snapshot staging | self-producing and mutually producing declarations | same-stage cycles rejected |
| Incremental compilation | visible/hidden field, attribute, target, generator changes | only actual dependencies invalidate |
| Reproducibility | repeated/parallel builds, changed host environment | identical semantic output/fingerprints |
| Resource bounds | recursion, allocation, solver explosion, output explosion | bounded termination with causal diagnostics |
| Runtime soundness | wrong key/receiver, alias conflict, panic, destructor | Miri and compile-fail suites find no safe UB |
| Registry | LTO, dead stripping, platforms, duplicates | reachable entries retained once |
| Zero-cost baseline | unused reflection library | no descriptor, section, or thunk remains |
| Performance | handwritten vs generated static vs dynamic | static path near handwritten within set tolerance |
| Code size | per-type/capability measurement | cost proportional and attributable |
| Procedural safety | pinning, live borrows, partial initialization, drops | unsafe transitions unrepresentable safely |
| Procedural fidelity | inspect, mutate certified local, resume, abort | state is causally connected at documented safepoints |

### 29.1 Privacy conformance example

```rust
// dependency crate
pub struct Account {
    id: u64,
    secret: Secret,
}

// downstream crate
const INFO: TypeInfo = reflect_runtime::project_public::<Account>();
```

Required result:

- `Account` may be discoverable;
- no `secret` field name is returned;
- no type identity for `Secret` is returned;
- no private-field count reveals its presence;
- no getter, offset, source location, or private attribute is emitted.

### 29.2 Zero-cost conformance example

Compare a baseline build with one linking the reflection runtime but never projecting a type. Required result after normal nondeterminism normalization:

- no reflection section;
- no `Player` descriptor;
- no invocation thunk;
- no reachable registry machinery.

### 29.3 Procedural conformance example

```rust
#[reflectable]
async fn transfer(mut balance: u64) -> Result<(), Error> {
    reflect_point!("before-debit");
    balance -= 10;
    commit(balance).await
}
```

At `before-debit`, `balance` may be exposed as a replaceable `u64` only if compiler analysis certifies replacement. The domain must not expose executor internals, fabricate references to dropped values, skip required effects, or resume after completion.

---

## 30. Open research questions

1. Which semantic properties should be stable across crate boundaries?
2. How should access authority flow through library-defined metaprograms called from owner modules?
3. Which normalization and trait-selection results are meaningful before monomorphization?
4. How should reflected opaque types and existential identities be represented?
5. What typed quotation syntax best integrates with Rust grammar and diagnostics?
6. Which borrowed method signatures admit a sound erased runtime ABI?
7. How should schema identity and compatibility be versioned independently of compiler identity?
8. What compilation budget defaults prevent denial of service without harming legitimate metaprograms?
9. How much process state can be exposed without freezing MIR implementation details into language guarantees?
10. Can explicit multi-stage generation be added without introducing implicit fixed-point semantics?
11. How should reflection interact with specialization, negative impls, auto traits, and future trait-solver evolution?
12. What reflection behavior is permitted for unsafe fields, union members, pinned/self-referential types, and foreign ABIs?

---

## 31. Final assessment

Semantic reflection is feasible for Rust and can substantially improve serialization, editors, ECS tooling, RPC, persistence, diagnostics, registries, schema evolution, and AI-readable program models. The technically defensible design is not unrestricted compiler introspection. It is a carefully staged system whose authority narrows at each boundary.

P2996 establishes the viability of an opaque compiler-owned semantic handle and compile-time reification. Rust's current initiative establishes a path through compile-time-only evaluation and privacy-preserving type descriptions. CallMeMaybe establishes that authoritative static reflection can generate a useful runtime registry. CLOS establishes the value of separating introspection from intercession. Smith establishes that true procedural reflection requires a causally connected representation of active computation.

The resulting Rust architecture preserves the language's defining guarantees by refusing five shortcuts:

- no syntax-only mechanism presented as semantic reflection;
- no unchecked private access;
- no raw runtime type-erasure contract;
- no semantic fixed point hidden inside compilation;
- no arbitrary mutation of active native execution.

The recommended foundation is therefore:

```text
semantic compiler entities
+ consteval-only meta::Info
+ ambiguity-preserving queries
+ typed hygienic reification
+ frozen-snapshot generation
+ ordinary coherence/privacy/safety checks
+ opt-in runtime projection
+ explicit reflectable execution domains
```

That architecture is expressive enough to deliver the practical benefits of modern reflection while preserving Rust's safety, coherence, privacy, deterministic compilation, and zero-cost-by-default model.

---

## References

1. Barry Revzin et al. **P2996R13: Reflection for C++26.** WG21, 2025.  
   https://www9.open-std.org/JTC1/SC22/WG21/docs/papers/2025/p2996r13.html

2. Rust Project Goals. **Reflection and comptime, 2026.**  
   https://rust-lang.github.io/rust-project-goals/2026/reflection-and-comptime.html

3. LaurieWired. **CallMeMaybe.**  
   https://github.com/LaurieWired/CallMeMaybe

4. Ricci Lab. **Building Clang P2996 C++26 Reflection.**  
   https://riccilab.dev/blog/building-clang-p2996-cpp26-reflection

5. Brian Cantwell Smith. **Procedural Reflection in Programming Languages.** MIT PhD dissertation, 1982.

6. Rust Reference. **Procedural Macros.**  
   https://doc.rust-lang.org/reference/procedural-macros.html

7. Rust Reference. **Constant Evaluation.**  
   https://doc.rust-lang.org/reference/const_eval.html

8. Rust Reference. **Type Layout.**  
   https://doc.rust-lang.org/reference/type-layout.html

9. Rust Reference. **Implementations and Coherence.**  
   https://doc.rust-lang.org/reference/items/implementations.html

10. Rust Reference. **Visibility and Privacy.**  
    https://doc.rust-lang.org/reference/visibility-and-privacy.html

11. rustc Development Guide. **Name Resolution; HIR Type Checking; THIR; MIR; Normalization; Trait Resolution; Incremental Compilation.**  
    https://rustc-dev-guide.rust-lang.org/

12. WG21 P3547R1. **Access Contexts for Reflection.**  
    https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2025/p3547r1.html

13. WG21 P3603R1. **Reflection and stable identity/hashing considerations.**  
    https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2025/p3603r1.html

14. `linkme` documentation. **DistributedSlice.**  
    https://docs.rs/linkme/latest/linkme/struct.DistributedSlice.html

15. `inventory` documentation.  
    https://docs.rs/inventory/latest/inventory/

---

## Appendix A. Decision matrix

| Design question | Decision |
|---|---|
| Reflection representation | one opaque compiler-owned consteval-only `meta::Info` |
| Query timing | query-specific prerequisites |
| Trait queries | contextual and ambiguity-preserving |
| Layout | target-specific and concrete-type only |
| Generation | frozen snapshot and one-way materialization |
| Reification | category-typed splicing |
| Runtime reflection | opt-in generated projection |
| Invocation | safe checked facade over audited generated thunks |
| Registration | explicit portable core; optional linker aggregation |
| Private structure | owner-authorized projection only |
| Generated impls | ordinary coherence checks |
| Procedural reflection | explicit domains and certified safepoints |
| Initial procedural backend | instrumented async/coroutines |
| Strongest research backend | MIR interpreter |
| Automatic fixed point | excluded |

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
[← Citations](../appendices/citations.md) | [Table of Contents](../SUMMARY.md) | [Notation →](../appendices/notation.md)
