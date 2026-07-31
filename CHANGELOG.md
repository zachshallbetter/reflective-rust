# Reflective Rust — Changelog

All notable changes to the **Reflective Rust** research program, specifications, and reference toolchain crates are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-31 — Canonical v1.0 Release

### Added
- **Canonical v1.0.0 Release**: Official production release of the Reflective Rust research monograph, RFC corpus, and toolchain workspace.
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
