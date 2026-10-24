---
title: "Reflective Rust: Semantic Reflection, Compiler Graphs, and Reflective Systems Architecture"
artifact: "research-manuscript"
status: "preprint-draft"
version: "0.1.0"
date: "2026-10-23"
author: "Zach Shallbetter"
summary: "A staged architecture for semantic reflection, compile-time metaprogramming, runtime semantic projection, and compiler-semantic graph exchange in Rust."
---

# Reflective Rust: Semantic Reflection, Compiler Graphs, and Reflective Systems Architecture

**Zach Shallbetter**  
**Manuscript status:** Research preprint draft, version 0.1.0  
**Date:** 23 October 2026  
**Project and implementation:** https://github.com/zachshallbetter/reflective-rust

## Abstract

Reflection and metaprogramming create a design tension for systems languages: developers need access to resolved program structure and controlled runtime introspection, while the language must preserve static checking, privacy, predictable compilation, and explicit costs. Rust's procedural-macro interface is powerful, but token-oriented macro input does not itself provide the complete semantic facts known to the compiler after name resolution and type checking. This paper presents Reflective Rust, a staged architecture that separates (1) compile-time semantic reflection through opaque compiler-owned handles; (2) deterministic, resource-bounded compile-time computation and typed reification; (3) opt-in runtime semantic projection into ordinary descriptors and checked adapters; and (4) an external Compiler Semantic Graph (CSG) representation for tools that need structured program information. A fourth, longer-term research direction—procedural reflection over active computation—is treated separately because inspecting or changing execution state raises distinct semantic and safety questions. The repository includes tested runtime protocols, descriptor derivation, graph exchange models, provenance validation, access filtering, and related examples. It does not currently implement Rust compiler semantic reflection or a compiler-produced CSG extractor, and this paper makes no claim that those proposals have been accepted by the Rust project or that zero-cost and performance properties have been empirically established. The contribution is an explicit architecture, claim taxonomy, and implementation boundary intended to guide future prototypes and evaluation.

**Keywords:** Rust; reflection; metaprogramming; compiler architecture; semantic graph; runtime metadata; provenance; programming languages

## 1. Introduction

Reflection is the ability of a program or tool to inspect information about program entities. Metaprogramming uses program structure to generate or transform programs. These capabilities support serialization, schema generation, dependency injection, plugin discovery, diagnostics, IDEs, static analysis, and increasingly automated software engineering. Yet a reflection design for a systems language cannot be evaluated solely by the convenience of its API. It must also define which semantic facts are available, at what compilation phase, under whose authority, at what cost, and with what effect on ordinary language rules.

Rust offers declarative macros, procedural macros, traits, derives, compiler diagnostics, and a strong static type system. Procedural macros are commonly supplied with token streams and operate outside the compiler's full semantic analysis. A macro can parse syntax and emit Rust, but its input alone is not a general, stable query interface for compiler-resolved types, trait relationships, privacy, or instantiated layout. Developers often bridge that gap by parsing syntax, relying on conventions, or maintaining metadata separately from the compiler.

Reflective Rust proposes a staged design rather than a single unrestricted reflection mechanism. It distinguishes semantic facts available during compilation from runtime data intentionally emitted into a program. It also separates an interoperable graph format for tools from the internal data structures of a particular compiler. These separations are architectural proposals, not descriptions of features already available on stable Rust.

### 1.1 Contributions

This paper makes four design contributions:

1. **A staged reflection architecture** that separates compiler-owned semantic handles, compile-time computation, typed reification, and opt-in runtime projection.
2. **A Compiler Semantic Graph (CSG) model** for exchanging structured declarations and relationships without exposing compiler-internal data structures as a public API.
3. **An explicit authority and provenance model** distinguishing compiler-certified information from declared, derived, observed, and fixture data.
4. **A claim-status discipline** that distinguishes documentation, implementation, automated testing, and empirical validation.

These are architectural contributions and a working protocol model. They are not evidence that compiler integration has been implemented or that the proposed language design has been experimentally validated.

## 2. Method and claim discipline

The work is a design and implementation report. It combines analysis of established language and reflection concepts with a proposed architecture and a Rust workspace containing executable protocol components. It is not a controlled performance study, a formal proof of soundness, or a report of an accepted Rust language change.

The manuscript uses four distinct evidence levels:

- **Specified:** described in the research documentation or proposed API.
- **Implemented:** executable behavior exists in the repository.
- **Tested:** automated tests exercise that behavior.
- **Empirically validated:** reproducible measurements or experiments establish a claim under a recorded method and environment.

These levels are not interchangeable. A design statement does not establish implementation; a passing unit test does not establish performance; and a valid exchange schema does not establish that a compiler can correctly populate it. Throughout this paper, proposals are identified as proposals and repository capabilities are limited to what the implementation-status record documents.

## 3. Problem formulation

### 3.1 Syntax is not semantic reflection

Procedural macros can inspect and transform syntax represented by token streams. Parsing those tokens into an abstract syntax tree improves structural understanding, but parsing does not by itself supply all compiler-resolved facts. In particular, syntax-level input should not be treated as an authoritative source for resolved type identity, contextual trait selection, monomorphized layout, or every applicable privacy and visibility decision.

This limitation does not make procedural macros defective; they serve a different interface contract. The architectural question is whether a language should also offer a supported way to query semantic facts once the compiler has established them.

### 3.2 Runtime introspection has a different contract

Compile-time reflection and runtime reflection are not equivalent. A compiler may know a field's type or a declaration's relationships during compilation without any requirement that the compiled program retain those facts. Runtime inspection requires metadata and operations to be emitted into the artifact. That can affect binary size, execution cost, compatibility, and access control.

Reflective Rust therefore proposes opt-in projection: programs explicitly request runtime-visible descriptors or checked adapters for the entities that need them.

### 3.3 Tools need structured semantics, not compiler internals

IDEs, analyzers, documentation systems, and AI-assisted tools benefit from structured declarations, relationships, source spans, and access constraints. Directly exposing unstable compiler-internal types would tightly couple every consumer to compiler implementation details. A versioned external graph schema offers a possible boundary between compiler-specific extraction and downstream consumers. Its reliability, however, depends on an actual extractor, defined semantics, provenance, and conformance tests—not merely on the existence of a schema.

## 4. Proposed architecture

Reflective Rust is organized as four principal layers, with procedural reflection treated as a separate research direction.

### 4.1 Semantic static reflection

The proposed language layer uses opaque, compiler-owned semantic handles, referred to in the repository as core::meta::Info. Such a handle would represent a compiler-resolved entity without exposing internal compiler data structures as ordinary Rust values. Queries would be available only in a permitted compile-time context.

The handle model is intended to preserve a crucial distinction: a reflection handle represents compiler-known semantic identity, not an arbitrary runtime pointer or a public wrapper around compiler internals. The precise API, supported queries, phase availability, and interaction with generics remain language-design questions. The repository's implementation-status document explicitly marks compiler semantic handles and queries as proposed and unavailable on stable Rust.

### 4.2 Compile-time computation and reification

A compile-time metaprogramming layer would allow bounded deterministic computation over semantic handles. Results could be reified into ordinary Rust declarations or expressions. Generated output would still be subject to ordinary name resolution, type checking, privacy, coherence, borrow checking, and unsafe-code rules.

This is an architectural requirement, not a claim that all such checks can be preserved automatically by any proposed implementation. A viable implementation must specify expansion order, dependency tracking, diagnostics, resource limits, and incremental invalidation. It must also avoid permitting generated code to bypass ordinary language authority.

### 4.3 Opt-in runtime semantic projection

Runtime semantic projection materializes a selected subset of program information as ordinary data structures. Depending on the application, this may include type and field descriptors, stable identifiers, provenance, access requirements, and explicitly generated operations. Only annotated or otherwise opted-in entities should acquire the metadata and adapters required by the chosen runtime feature.

The current workspace implements a v0.1 runtime semantic protocol and opt-in derived descriptors. According to docs/IMPLEMENTATION_STATUS.md, tested capabilities include versioned envelopes, deterministic descriptor identity, authenticated envelopes, provenance classes, freshness validation for observations, compatibility checks, access projection, operational semantic graph validation, and derived descriptors for supported Rust type shapes. These features demonstrate a runtime protocol and descriptor implementation; they do not implement compiler semantic reflection.

“Zero cost” is therefore a design objective with a specific possible interpretation—no reflection metadata or runtime machinery for unprojected entities—not a measured result established by this paper. Any such claim requires a controlled baseline, defined workloads, compiler and target details, binary-size measurements, runtime measurements, and reproducible results.

### 4.4 Compiler Semantic Graph

The CSG is proposed as a versioned, out-of-process representation of compiler-derived program semantics. The repository's exchange model represents nodes, edges, source spans, access requirements, schema version, provenance, and optional certification. This separates the graph consumers exchange from the compiler's internal representation.

A production CSG requires a real compiler extractor and a documented mapping from compiler concepts to schema entities and relationships. It also requires rules for incomplete or ambiguous information, generic and instantiated entities, stable identifiers, source changes, access boundaries, and schema evolution. At the time recorded by the repository's implementation-status document, no rustc, Cranelift, GCC, or LLVM compiler extractor exists in the workspace. Compiler-produced certification and cross-backend conformance are therefore not established.

### 4.5 Procedural reflection as a separate domain

Procedural reflection asks a harder question than inspecting declarations: can a running or suspended computation inspect and influence the computation that is being represented? Work on reflective interpreters and metaobject protocols provides useful conceptual background, but arbitrary optimized native execution does not automatically preserve a source-level environment or continuation that can safely be exposed.

The project therefore treats procedural reflection as a long-term, explicit execution-domain proposal involving retained or interpreted state, typed views, capabilities, and certified resumption points. It is not required for the initial semantic-reflection or runtime-projection layers, and it is not implemented by the current workspace.

## 5. Authority, provenance, and access

A semantic tool should not present all facts as though they had equal authority. A compiler-derived fact, a developer-declared property, a value inferred by a tool, and an observation made at runtime answer different questions and can have different freshness and trust guarantees.

The runtime protocol models provenance classes such as compiler-certified, declared, derived, and observed. The CSG exchange model also distinguishes compiler provenance from fixtures. The implementation validates required identity and source-hash fields, schema compatibility, graph node uniqueness, edge integrity, and access requirements. The runtime protocol includes authenticated envelopes and access-aware projection.

These mechanisms establish protocol-level checks, not universal truth. A signature can establish that a particular key signed particular content; it cannot by itself prove that an extractor is correct. A graph can pass structural validation while still containing semantically incorrect data if its producer is faulty. Consumers should therefore treat provenance as an explicit statement of origin and authority, not as a substitute for a trustworthy producer or independent verification.

Privacy must also be enforced at the projection boundary. Metadata being known to a compiler does not imply that it should be available to every downstream consumer. The design requires access requirements to travel with entities and relationships and to be enforced when a projection is created. The exact relationship between Rust visibility, compiler privileges, generated adapters, and application-level capabilities remains a key area for formal specification and testing.

## 6. Implementation status

The current repository is a reference workspace for runtime protocols and related models. Its own implementation-status document states that it is **not a Rust compiler reflection implementation**.

| Capability | Status reported by repository | What can be concluded |
|---|---|---|
| Versioned runtime semantic envelopes | Tested | Protocol validation and serialization paths exist. |
| Deterministic descriptor identity | Tested | Canonicalization and hashing have automated checks. |
| Authenticated envelopes | Tested | Signing and rejection paths are exercised by tests. |
| Provenance and observation freshness | Tested | The protocol validates defined provenance and time-window constraints. |
| Access-aware descriptor projection | Tested | Projection filters information by configured access levels. |
| Operational Semantic Graph validation | Tested | Graph structure and edge integrity are checked. |
| Opt-in derived type descriptors | Tested | Supported type shapes have a runtime descriptor path. |
| CSG exchange model | Tested | Schema validation and fixture/provenance modeling exist. |
| Access-aware CSG slicing | Tested | Graph traversal and access filtering are implemented. |
| Compiler semantic handles and queries | Proposed | No stable-Rust implementation is claimed. |
| Compiler-produced CSG extractor | Not implemented | The schema is not evidence of compiler extraction. |
| Cross-backend semantic conformance | Not implemented | No cross-backend equivalence result is claimed. |
| Production HTTP service | Not implemented | The server is documented as a bounded protocol-discovery example. |
| Published performance guarantees | Not established | Local measurements, if any, are not a workspace-wide validation. |

The table is a snapshot based on the repository's implementation-status document and should be rechecked against the exact revision associated with any future deposited manuscript. It is not an independent audit of every source file or test result.

## 7. Evaluation plan

The architecture creates several testable research questions. A meaningful evaluation should be designed before claiming that the proposed system is faster, safer, or more portable than alternatives.

### 7.1 Semantic correctness

A future compiler reflection implementation should be tested against compiler-resolved facts for aliases, generic instantiations, trait implementations, visibility, layout-sensitive questions, and conditional compilation. Each test should specify the compiler version, expected semantic result, and the conditions under which information is unavailable or ambiguous.

### 7.2 Incremental compilation and build cost

The compile-time design should be evaluated on projects with and without reflection use. Measurements should separate compiler work, metaprogram execution, generated-code volume, cache behavior, and dependency invalidation. Claims about avoiding duplicate parsing or reducing build time require controlled baselines; general percentages should not be asserted without reproducible measurements.

### 7.3 Runtime overhead and artifact size

For runtime projection, compare projected and unprojected builds using defined workloads. Report metadata size, binary size, allocations, descriptor lookup latency, serialization cost, and invocation overhead where applicable. Publish raw results, toolchain and hardware details, commands, and analysis scripts. A claim of zero overhead should be limited to a precisely defined unprojected path and supported by measurement.

### 7.4 Security and provenance

Adversarial tests should cover malformed schemas, duplicate identifiers, dangling edges, altered signed payloads, key substitution, expired observations, privilege escalation, and accidental leakage through graph traversal or projection. A future compiler extractor also needs a trust model for extractor identity and version, source correspondence, and reproducibility.

### 7.5 Cross-backend conformance

If multiple compiler backends are supported, conformance vectors should compare their exported semantic facts while distinguishing genuine semantic differences from missing backend support. No cross-backend equivalence should be inferred from a shared schema alone.

## 8. Related work and conceptual lineage

Reflective Rust draws on established work in procedural reflection, metaobject protocols, programming-language semantics, and static metaprogramming. Smith's dissertation on procedural reflection explores reflective systems in which a program can represent and act upon aspects of its own computation. Kiczales, des Rivières, and Bobrow's *The Art of the Metaobject Protocol* provides a foundational account of structured reflection and controlled adaptation in object systems. These works motivate treating reflection as an architectural and semantic question rather than simply a metadata API.

Modern compile-time reflection proposals, including the C++ reflection work associated with P2996, provide a contemporary point of comparison for opaque semantic handles and compile-time queries. Rust's ownership, privacy, trait coherence, macro expansion, and compilation model impose their own constraints; an API or mechanism from another language cannot simply be assumed to transfer.

The Rust Reference and rustc development documentation are primary resources for describing the existing language and compiler architecture. The repository's bibliography should be treated as a research starting point, not as proof that each source supports every claim in this paper. Before formal submission, bibliographic metadata and the exact versions of evolving proposals must be checked against primary sources, and a more systematic related-work search should be documented.

## 9. Limitations and open questions

Several limitations constrain the conclusions that can be drawn from this work.

First, the proposed semantic-reflection API is not implemented in stable Rust. The manuscript therefore cannot demonstrate its usability, soundness, compile-time cost, or compatibility with the actual compiler pipeline.

Second, the CSG exchange model does not yet have a compiler extractor. Its schema and validation logic establish a possible data contract, not the completeness or correctness of compiler-derived graphs.

Third, the current runtime implementation covers selected descriptor and protocol behaviors. Its test status should not be generalized to every architecture layer. In particular, it does not prove zero-cost behavior, eliminate hallucination by AI tools, or establish production readiness for a service.

Fourth, the architecture is broad. The interactions among phase availability, incremental compilation, generics, privacy, generated declarations, compiler versioning, and cross-backend semantics require narrower specifications and executable prototypes. Procedural reflection is particularly speculative and should be evaluated independently of the near-term layers.

Finally, this paper does not claim peer review, formal verification, adoption by the Rust project, or empirical superiority over existing approaches. Those would require separate evidence.

## 10. Conclusion

Reflective Rust proposes a staged approach to reflection in a systems language: compiler-owned semantic handles for compile-time queries, bounded compile-time computation and ordinary checked reification, opt-in runtime projection, and a versioned external graph for semantic tooling. Procedural reflection is separated as a distinct research direction because access to active computation requires stronger execution-model guarantees than declaration metadata.

The most important architectural boundary is the distinction between a proposed compiler capability and the runtime protocol machinery already present in the repository. The current workspace provides tested components for descriptors, provenance, access-aware projection, and graph exchange. It does not yet provide compiler semantic reflection or compiler-produced semantic graphs. Preserving that distinction makes the project more useful as a research program: the next steps are concrete and falsifiable—implement a narrow compiler integration, define conformance vectors, evaluate semantic correctness and costs, and publish reproducible results.

## References

The following are starting references for the concepts discussed. Bibliographic details and version-specific claims should be verified against the primary publication or project record before formal submission.

1. Smith, B. C. *Procedural Reflection in Programming Languages*. PhD dissertation, Massachusetts Institute of Technology, 1982.
2. Kiczales, G., des Rivières, J., and Bobrow, D. G. *The Art of the Metaobject Protocol*. MIT Press, 1991.
3. Jung, R., Jourdan, J.-H., Krebbers, R., and Dreyer, D. “RustBelt: Securing the Foundations of the Rust Programming Language.” *Proceedings of the ACM on Programming Languages*, 2(POPL), 2017.
4. ISO/IEC JTC1/SC22/WG21. “P2996: Reflection for C++.” Proposal series; consult the official WG21 paper archive for the exact revision cited.
5. The Rust Project. *The Rust Reference*. https://doc.rust-lang.org/reference/
6. The Rust Project. *rustc Development Guide*. https://rustc-dev-guide.rust-lang.org/
7. Shallbetter, Z. *Reflective Rust* repository and implementation-status record. https://github.com/zachshallbetter/reflective-rust

## Artifact and reproducibility note

This manuscript is maintained in the Reflective Rust repository. For reproducibility, any public deposit should identify the exact repository commit and software release, preserve the implementation-status snapshot, and avoid assigning journal, volume, issue, or page metadata unless a real venue supplies those details. The paper's version and the software's version are separate artifacts and should be cited separately.
