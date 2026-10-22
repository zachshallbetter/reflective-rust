# Reflective Rust - Changelog

## [Unreleased]

> Historical note: older 1.x/0.x research-corpus entries below are legacy repository notes, not a reliable substitute for the published GitHub release list or current implementation status. Earlier claims about compiler reflection, cross-backend conformance, zero-cost behavior, and production services are superseded by [the verified implementation status](docs/IMPLEMENTATION_STATUS.md).

### Changed
- Reconciled workspace version, protocol identifiers, implementation status, and release instructions across canonical docs.
- Qualified unsupported build-time and zero-cost claims; identified compiler-reflection APIs as proposals rather than implemented stable Rust features.
- Clarified that external-consumer test claims are maintainer-reported unless their evidence is present in this repository.
- Updated the documentation changelog gate to require the root changelog rather than nonexistent per-layer changelogs.
- Updated the README to distinguish the current workspace version from the latest published packaging release and to make implementation boundaries and feedback requests easier to find.
- Added a runnable derive-macro example that serializes an opt-in runtime type descriptor as JSON.
- Advanced the executable workspace to `0.2.0`; the runtime and CSG schema identifiers remain independently versioned as `rr-rsp-0.1` and `rr-csg-0.1`.
- Added the canonical Runtime Semantic Projection envelope and Operational Semantic Graph, including provenance, compatibility, access projection, validation, JCS serialization, and SHA-256 identity.
- Added authenticated envelopes with Ed25519 signatures, trusted key-ID binding, explicit compatibility checks, and enforced RFC 3339 freshness windows for observations.
- Reworked `#[derive(Reflectable)]` to implement the shared runtime descriptor trait for structs, generics, and enums.
- Made CSG provenance explicit and distinguished compiler-produced graphs from fixtures.
- Replaced fabricated compiler metadata, unsafe raw-memory serialization, false cross-backend conformance, and hard-coded performance assertions with honest boundaries and testable behavior.
- Removed the word-count and unverified “value metrics” gate; repository gates now verify code, structure, links, changelog discipline, and generated-corpus determinism.
- Updated repository status, terminology, examples, and verification gates to match implemented behavior.
- Labeled interactive explorer diagrams as illustrative proposals/fixtures and removed unverified zero-cost and zero-hallucination claims.
- Clarified that the CSG and context-slicing explorer panels use hard-coded demonstration data rather than compiler-extracted evidence.
- Fixed empty-metrics TypeScript inference in the evidence dashboards and clarified the server panel's example-only status.

## [0.1.3] - 2026-10-11

### Changed
- Moved repository governance documents (`authority`, `versioning`, `conformance`, `releasing`, `publishing`) from the repository root into `docs/meta/` so the root matches the public product surface (README, citation, licenses, contributing, changelog).
- Structure gate and `llms` corpus generation now read governance docs from `docs/meta/`.
- Removed local assistant note file from the tracked tree.


All notable changes to the **Reflective Rust** research program, specifications, and reference toolchain crates are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.1] - 2026-07-31

### Added
- **Static Reflection `Sized` Trait Invariant**: Documented `where Self: Sized` requirement on static size reflection default trait methods (`std::mem::size_of::<Self>()`) in `docs/03-rust-language-proposal/meta-info.md`.
- **Declarative MOP Privacy Attributes**: Added Section 3 (`#[meta(permit = "role")]`) in `docs/05-metaobjects/contract-attributes-framework.md` isolating access control policies across REST, WASM, and GraphQL boundaries.
- **Empirical Negative Results**: Recorded empirical negative findings in `docs/09-research/rejected-designs.md` regarding unbounded static trait size evaluation (`E0277`) and stringified JSON parsing inside 60 FPS WebGL render loops.
- **Special Acknowledgment**: Added prominent acknowledgment to **LaurieWired** ([GitHub](https://github.com/LaurieWired), [YouTube](https://www.youtube.com/@LaurieWired), video [*Reverse Engineering Rust Vtables*](https://www.youtube.com/watch?v=M_720LesVg4)) at the top of `docs/README.md` and `docs/00-foundations/00-abstract.md`.

---

## [1.0.0] - 2026-07-31 - Canonical v1.0 Release

### Added
- **Canonical v1.0.0 Release**: Official production release of the Reflective Rust research monograph, RFC corpus, and toolchain workspace.
- **Deep Monograph Prose Expansion**: Deeply expanded foundational, language proposal, CSG architecture, and Graph RAG agent slicing research monographs across `docs/`. Total volume: **29,913 words**.
- **8 Real-World Industrial Examples**: Added 4 real-world industrial use cases (`serde_zero_copy_serialization`, `ecs_component_engine`, `rpc_dynamic_dispatcher`, `ai_agent_copilot`) alongside core reference examples.
- **Extended Static Meta Queries (`reflective-rust-meta v1.0.0`)**: Added `variants_of`, `function_info`, `VariantInfo`, and `FunctionInfo` query metadata.
- **8 Workspace Toolchain Crates (`v1.0.0`)**:
  - `reflective-rust-meta`: Core static reflection handle `#![no_std]` substrate (`core::meta::Info`, `layout_of`, `fields_of`, `variants_of`).
  - `reflective-rust-csg`: Compiler Semantic Graph out-of-process JSON query engine.
  - `reflective-rust-derive`: Opt-in zero-cost runtime VTable descriptor generator (`#[derive(Reflectable)]`).
  - `reflective-rust-agent`: Graph RAG context slicer (`csg::slice_around`) feeding compiler-certified type and privacy bounds to AI tools.
  - `reflective-rust-server`: Out-of-process HTTP query server (`/api/csg`, `/api/slice`).
  - `reflective-rust-bench`: Empirical performance benchmark suite and quantitative proof verification.
  - `reflective-rust-conformance`: Cross-backend schema validation suite across LLVM, Cranelift, and GCC.
  - `reflective-rust-cli`: Command-line toolchain driver (`inspect`, `csg-export`, `agent-slice`, `bench`, `conformance`).
- **Academic Citations & Lineage**: Incorporated formal academic bibliography acknowledging Brian Cantwell Smith (3-Lisp 1982), Gregor Kiczales (CLOS MOP 1991), C++ P2996, and Rust Core Team.
- **Value Metrics Gate (`scripts/verify-value-metrics.py`)**: Automated verification gate tracking research volume (115 chapters), zero-cost memory invariants (0 bytes), and test coverage.

---

## [0.2.1] - 2026-07-31

### Added
- Cross-Backend Conformance Vector Crate (`reflective-rust-conformance v0.2.0`).
- Interactive Toolchain Driver (`reflective-rust-cli v0.2.0`).
- `RFC 0005: Cross-Backend Conformance Vectors`.
- Empirical Benchmark Crate (`reflective-rust-bench v0.2.0`).
- Empirical Proof & Metrics Specification (`docs/09-research/performance-and-empirical-proof.md`).

---

## [0.2.0] - 2026-07-31

### Added
- Scope I Reference Crate (`reflective-rust-meta v0.2.0`).
- Scope II CSG Substrate (`reflective-rust-csg v0.2.0`).
- Scope II Runtime Descriptors (`reflective-rust-derive v0.2.0`).
- Scope III Agentic Graph RAG Slicer (`reflective-rust-agent v0.2.0`).
- Scope III CSG HTTP Query Server (`reflective-rust-server v0.2.0`).
- Upstream RFC Corpus (RFCs 0001 - 0004).

---

## [0.1.0] - 2026-07-31

### Added
- Initial release of Reflective Rust research corpus and 108 modular chapter specifications.
