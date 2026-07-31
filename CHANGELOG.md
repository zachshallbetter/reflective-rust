# Reflective Rust — Changelog

All notable changes to the **Reflective Rust** research program, specifications, and reference toolchain crates are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] - 2026-07-31

### Added
- **Scope I Reference Crate (`reflective-rust-meta v0.2.0`)**: `#![no_std]` core substrate for `core::meta::Info`, `layout_of`, `fields_of`, and consteval reflection queries.
- **Scope II CSG Substrate (`reflective-rust-csg v0.2.0`)**: Standardized out-of-process Compiler Semantic Graph schema, `CsgNode`, `CsgEdge`, `SourceSpan`, and JSON serialization.
- **Scope II Runtime Descriptors (`reflective-rust-derive v0.2.0`)**: `#[derive(Reflectable)]` procedural macro generating static VTables (`TypeDescriptor`, `FieldDescriptor`) with zero runtime memory cost for un-annotated types.
- **Scope III Agentic Graph RAG Slicer (`reflective-rust-agent v0.2.0`)**: `csg::slice_around` context extraction engine feeding compiler-certified type and privacy bounds to AI tools.
- **Scope III CSG HTTP Query Server (`reflective-rust-server v0.2.0`)**: Out-of-process HTTP query server serving `/api/csg` and `/api/slice`.
- **Upstream RFC Corpus (RFCs 0001 - 0004)**:
  - `RFC 0001`: Static Semantic Reflection & `core::meta`
  - `RFC 0002`: Compiler Semantic Graph (CSG) Specification
  - `RFC 0003`: Opt-In Zero-Cost Runtime Descriptors
  - `RFC 0004`: Agentic Context Slicing & Spatial Anchor Protocol
- **Layer Versioning & Infrastructure**: Added `VERSIONING.md`, `RELEASING.md`, `PUBLISHING.md`, GitHub Actions CI gate (`.github/workflows/ci.yml`), `scripts/check-changelogs.py`, and `llms-full.txt` (263.1 KB).

### Changed
- Reorganized 112 conceptual chapters into [`docs/`](docs/) following standard mdBook layout best practices (`src = "docs"`).
- Unified toolchain crates under root [`Cargo.toml`](Cargo.toml) workspace.

---

## [0.1.0] - 2026-07-31

### Added
- Initial release of Reflective Rust research corpus and 108 modular chapter specifications.
- Established resolution hierarchy (`AUTHORITY.md`), CITATION metadata (`CITATION.cff`), and research doctrine (`.agents/AGENTS.md`).
