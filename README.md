# Reflective Rust

**A research program and reference implementation for provenance-aware semantic reflection in Rust.** The repository separates language and compiler proposals from an executable workspace that implements portable runtime semantic contracts—without fabricating compiler reflection that stable Rust cannot provide.

[![Release](https://img.shields.io/github/v/release/zachshallbetter/reflective-rust?label=release&color=4da3ff)](https://github.com/zachshallbetter/reflective-rust/releases/latest)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.23290715.svg)](https://doi.org/10.5281/zenodo.23290715)
[![CI](https://github.com/zachshallbetter/reflective-rust/actions/workflows/ci.yml/badge.svg)](https://github.com/zachshallbetter/reflective-rust/actions/workflows/ci.yml)
[![License: MIT OR Apache-2.0](https://img.shields.io/badge/license-MIT%20OR%20Apache--2.0-blue)](LICENSE)
![Workspace: 0.1.0](https://img.shields.io/badge/workspace-0.1.0-2dd4bf)
![Status: research software](https://img.shields.io/badge/status-research%20software-4da3ff)

> The Cargo workspace version (**0.1.0**) tracks the **executable reference implementation only**. Theory, compiler interface, and tooling-projection layers version independently. Matching numbers across layers never imply conformance—see [`VERSIONING.md`](VERSIONING.md).

## The idea

Most “reflection” stories either overclaim what a language can expose or collapse compiler facts, runtime descriptors, and operational topology into one informal blob. Reflective Rust keeps three kinds of knowledge distinct:

| Kind | Meaning | Status in this repository |
|---|---|---|
| **Compiler Semantic Graph (CSG)** | Compiler-resolved program facts | Exchange schema implemented; **no** compiler extractor yet—hand-authored graphs are fixtures and must say so |
| **Runtime Semantic Projection (RSP)** | Opt-in type, capability, runtime, and observation descriptors in a versioned envelope | Implemented: provenance, access policy, validation, canonical JSON, SHA-256 identity, optional Ed25519 authentication |
| **Operational Semantic Graph (OSG)** | Runtime topology—services, capabilities, providers, contracts, stores, authority boundaries | Implemented as structured descriptors in the protocol crate |

Compiler reflection facilities such as `core::meta::Info`, semantic queries, reification, generation, and compiler-emitted CSG remain a **language and compiler proposal**. Stable Rust cannot implement those facilities faithfully. This workspace does **not** simulate them with fabricated metadata.

## What is here

| Path | Role |
|---|---|
| [`crates/`](crates/) | Executable workspace (protocol, derive, CSG schema, conformance, CLI, server, bench) |
| [`docs/`](docs/) | Foundations, runtime protocol docs, language proposal, compiler notes, reference |
| [`CONFORMANCE.md`](CONFORMANCE.md) | Explicit cross-layer conformance record |
| [`VERSIONING.md`](VERSIONING.md) | Independent layer versioning policy |
| [`scripts/`](scripts/) | Structure and corpus gates used in CI |

### Workspace crates

| Crate | Role |
|---|---|
| `reflective-rust-protocol` | RSP envelopes, descriptors, OSG, validation, access projection, JCS, identity, authentication |
| `reflective-rust-derive` | `#[derive(Reflectable)]` for opt-in type descriptors |
| `reflective-rust-meta` | Size/alignment utility and explicit compiler-reflection boundary |
| `reflective-rust-csg` | Validated CSG exchange schema with mandatory compiler-or-fixture provenance |
| `reflective-rust-agent` | Radius-bounded, access-aware CSG context slices |
| `reflective-rust-conformance` | Golden canonical-hash vectors for the implemented RSP protocol |
| `reflective-rust-bench` | Local measurements **without** performance claims |
| `reflective-rust-server` | Minimal read-only protocol discovery endpoint |
| `reflective-rust-cli` | Minimal protocol discovery command |

## Quick start

```rust
use reflective_rust_derive::Reflectable;
use reflective_rust_protocol::Reflect;

#[derive(Reflectable)]
struct Account {
    id: u64,
    nickname: Option<String>,
}

let descriptor = Account::type_descriptor();
assert_eq!(descriptor.fields.len(), 2);
assert!(descriptor.fields[1].optional);
```

## Verification

```bash
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --all-targets
python3 scripts/check-structure.py
node scratch/verify-links.mjs
```

Continuous integration runs the same family of gates on every push and pull request to `main` ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)).

## Where to read next

- [Implementation status](docs/IMPLEMENTATION_STATUS.md)
- [Conformance record](CONFORMANCE.md)
- [Descriptor protocol](docs/04-runtime/descriptor-protocol.md)
- [Operational Semantic Graph](docs/04-runtime/operational-semantic-graph.md)
- [Adoption profiles](docs/08-reference/adoption-profiles.md)
- [Language proposal](docs/03-rust-language-proposal/README.md) (proposal, not implemented reflection)

## Versioning

Layers version independently. The repository release tag **`v0.1.2`** is the public packaging release for workspace **0.1.0** (see [`Cargo.toml`](Cargo.toml) workspace package version). It does not claim completion of the language or compiler proposals.

Authoritative policy: [`VERSIONING.md`](VERSIONING.md).

## Licensing

Dual-licensed under **MIT OR Apache-2.0**. See [`LICENSE`](LICENSE), [`LICENSE-MIT`](LICENSE-MIT), and [`LICENSE-APACHE`](LICENSE-APACHE).

## Citation

If you use this software, please cite it.

```bibtex
@software{shallbetter_reflective_rust_0_1_2,
  author    = {Shallbetter, Zachary},
  title     = {Reflective Rust},
  year      = {2026},
  version   = {0.1.2},
  publisher = {Zenodo},
  doi       = {10.5281/zenodo.23290715},
  url       = {https://doi.org/10.5281/zenodo.23290715},
  orcid     = {0009-0009-9450-3429}
}
```

Machine-readable citation metadata: [`CITATION.cff`](CITATION.cff).  
Archival deposit metadata: [`.zenodo.json`](.zenodo.json).

> **DOI (this version):** [10.5281/zenodo.23290715](https://doi.org/10.5281/zenodo.23290715)  
> **Concept DOI (all versions):** [10.5281/zenodo.23290630](https://doi.org/10.5281/zenodo.23290630)

## Author

**Zachary Shallbetter**  
ORCID: [0009-0009-9450-3429](https://orcid.org/0009-0009-9450-3429)
