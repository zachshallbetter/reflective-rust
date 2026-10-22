# Reflective Rust

**A research program and reference implementation for provenance-aware semantic reflection in Rust.** The repository separates language and compiler proposals from an executable workspace that implements portable runtime semantic contracts—without fabricating compiler reflection that stable Rust cannot provide.

[![Release](https://img.shields.io/github/v/release/zachshallbetter/reflective-rust?label=release&color=4da3ff)](https://github.com/zachshallbetter/reflective-rust/releases/latest)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23290715.svg)](https://doi.org/10.5281/zenodo.23290715)
[![CI](https://github.com/zachshallbetter/reflective-rust/actions/workflows/ci.yml/badge.svg)](https://github.com/zachshallbetter/reflective-rust/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue)](LICENSE)
![Workspace: 0.2.0](https://img.shields.io/badge/workspace-0.2.0-2dd4bf)
![Status: research software](https://img.shields.io/badge/status-research%20software-4da3ff)

> The Cargo workspace version (**0.2.0**) tracks the executable reference implementation only. Theory, compiler interface, and tooling-projection layers version independently. Matching numbers across layers never imply conformance—see [the versioning policy](docs/meta/versioning.md). The latest public packaging release is [v0.1.3](https://github.com/zachshallbetter/reflective-rust/releases/tag/v0.1.3), published when the workspace version was 0.1.0; the current main branch has since advanced to 0.2.0.

## The idea

Most “reflection” stories either overclaim what a language can expose or collapse compiler facts, runtime descriptors, and operational topology into one informal blob. Reflective Rust keeps three kinds of knowledge distinct:

| Kind | Meaning | Status in this repository |
|---|---|---|
| **Compiler Semantic Graph (CSG)** | Compiler-resolved program facts | Exchange schema implemented; **no** compiler extractor yet—hand-authored graphs are fixtures and must say so |
| **Runtime Semantic Projection (RSP)** | Opt-in type, capability, runtime, and observation descriptors in a versioned envelope | Implemented: provenance, access policy, validation, canonical JSON, SHA-256 identity, optional Ed25519 authentication |
| **Operational Semantic Graph (OSG)** | Runtime topology—services, capabilities, providers, contracts, stores, authority boundaries | Implemented as structured descriptors in the protocol crate |

Compiler reflection facilities such as core::meta::Info, semantic queries, reification, generation, and compiler-emitted CSG remain a **language and compiler proposal**. Stable Rust cannot implement those facilities faithfully. This workspace does **not** simulate them with fabricated metadata.

## Try it

Requirements: Rust 1.88 or newer.

The example derives an opt-in runtime descriptor for a normal Rust type, then prints the descriptor as JSON:

    cargo run -p reflective-rust-derive --example describe_type

Example source: [crates/reflective-rust-derive/examples/describe_type.rs](crates/reflective-rust-derive/examples/describe_type.rs).

The example reports the type name and layout along with each field's name, type, optionality, access level, and available offset. These are runtime descriptor facts produced by the derive macro; they are **not** compiler-certified semantic reflection.

## What is here

| Path | Role |
|---|---|
| [crates/](crates/) | Executable workspace (protocol, derive, CSG schema, conformance, CLI, server, bench) |
| [docs/](docs/) | Foundations, runtime protocol docs, language proposal, compiler notes, reference |
| [Implementation status](docs/IMPLEMENTATION_STATUS.md) | What is implemented, tested, proposed, or not implemented |
| [Conformance record](docs/meta/conformance.md) | Explicit cross-layer conformance record |
| [Versioning policy](docs/meta/versioning.md) | Independent layer versioning policy |
| [scripts/](scripts/) | Structure and corpus gates used in CI |

### Workspace crates

| Crate | Role |
|---|---|
| reflective-rust-protocol | RSP envelopes, descriptors, OSG, validation, access projection, JCS, identity, authentication |
| reflective-rust-derive | #[derive(Reflectable)] for opt-in type descriptors |
| reflective-rust-meta | Size/alignment utility and explicit compiler-reflection boundary |
| reflective-rust-csg | Validated CSG exchange schema with mandatory compiler-or-fixture provenance |
| reflective-rust-agent | Radius-bounded, access-aware CSG context slices |
| reflective-rust-conformance | Golden canonical-hash vectors for the implemented RSP protocol |
| reflective-rust-bench | Local measurements **without** performance claims |
| reflective-rust-server | Minimal read-only protocol discovery endpoint |
| reflective-rust-cli | Minimal protocol discovery command |

## Implementation status at a glance

- **Implemented and tested:** opt-in type descriptors, versioned runtime envelopes, validation, canonical JSON and SHA-256 identity, optional Ed25519 authentication, access projection, and structured OSG descriptors.
- **Schema implemented; compiler integration absent:** CSG exchange types can represent compiler-produced or fixture data with explicit provenance, but there is no compiler extractor in this repository.
- **Proposed, not implemented:** compiler-level reflection handles and queries, reification, generation, and compiler-emitted semantic graphs.
- **Not claimed:** production HTTP service, cross-backend compiler conformance, or general performance guarantees.

See the [detailed implementation status](docs/IMPLEMENTATION_STATUS.md) and [conformance record](docs/meta/conformance.md) for evidence and boundaries.

## Where feedback would be most useful

This is research software, and architectural criticism is welcome. In particular:

1. Is separating compiler facts, runtime descriptors, and operational topology a useful boundary, or does it add unnecessary concepts?
2. Which responsibilities belong in derive macros, runtime libraries, and future compiler integrations?
3. Which existing Rust patterns or projects should inform—or replace—parts of this design?

Issues and pull requests are welcome, especially when they include a concrete alternative or a minimal reproduction.

## Verification

    cargo fmt --all --check
    cargo clippy --workspace --all-targets -- -D warnings
    cargo test --workspace --all-targets
    python3 scripts/check-structure.py
    node scratch/verify-links.mjs

Continuous integration runs the same family of gates on every push and pull request to main ([.github/workflows/ci.yml](.github/workflows/ci.yml)).

## Where to read next

- [Implementation status](docs/IMPLEMENTATION_STATUS.md)
- [Conformance record](docs/meta/conformance.md)
- [Descriptor protocol](docs/04-runtime/descriptor-protocol.md)
- [Operational Semantic Graph](docs/04-runtime/operational-semantic-graph.md)
- [Adoption profiles](docs/08-reference/adoption-profiles.md)
- [Language proposal](docs/03-rust-language-proposal/README.md) (proposal, not implemented reflection)

## Versioning

Layers version independently. The current Cargo workspace version is **0.2.0** for the executable reference implementation. The latest public packaging release is **v0.1.3**, published when the workspace version was 0.1.0; release tags and workspace crate versions serve different purposes. Neither version claims completion of the language or compiler proposals.

Authoritative policy: [docs/meta/versioning.md](docs/meta/versioning.md).

## Licensing

Dual-licensed under **MIT OR Apache-2.0**. See [LICENSE](LICENSE), [LICENSE-MIT](LICENSE-MIT), and [LICENSE-APACHE](LICENSE-APACHE).

## Citation

If you use this software, please cite it.

    @software{shallbetter_reflective_rust_0_1_3,
      author    = {Shallbetter, Zachary},
      title     = {Reflective Rust},
      year      = {2026},
      version   = {0.1.3},
      publisher = {Zenodo},
      doi       = {10.5281/zenodo.23290715},
      url       = {https://doi.org/10.5281/zenodo.23290715},
      orcid     = {0009-0009-9450-3429}
    }

Machine-readable citation metadata: [CITATION.cff](CITATION.cff).  
Archival deposit metadata: [.zenodo.json](.zenodo.json).

> **DOI (this version):** [10.5281/zenodo.23290715](https://doi.org/10.5281/zenodo.23290715)  
> **Concept DOI (all versions):** [10.5281/zenodo.23290630](https://doi.org/10.5281/zenodo.23290630)

## Author

**Zachary Shallbetter**  
ORCID: [0009-0009-9450-3429](https://orcid.org/0009-0009-9450-3429)
