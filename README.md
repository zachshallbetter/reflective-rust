# Reflective Rust

Reflective Rust is a research program for semantic reflection in Rust and an experimental implementation of portable runtime semantic contracts.

The repository deliberately separates three different kinds of knowledge:

- **Compiler Semantic Graph (CSG):** compiler-resolved program facts. The format is implemented; no compiler extractor is implemented yet, so hand-authored graphs are explicitly marked as fixtures.
- **Runtime Semantic Projection (RSP):** opt-in type, capability, runtime, and observation descriptors carried in a versioned envelope with provenance, access policy, validation, canonical JSON, and SHA-256 identity.
- **Operational Semantic Graph (OSG):** runtime topology—services, capabilities, providers, contracts, models, stores, authority boundaries, and their relationships.

Compiler reflection (`core::meta::Info`, semantic queries, reification, generation, and compiler-emitted CSG data) remains a language and compiler proposal. Stable Rust cannot implement those facilities faithfully, and this workspace does not simulate them with fabricated metadata.

## Implemented workspace

| Crate | Current role |
| --- | --- |
| `reflective-rust-protocol` | Canonical RSP envelopes, descriptors, OSG, validation, access projection, JCS serialization, SHA-256 identity, and Ed25519 authentication |
| `reflective-rust-derive` | `#[derive(Reflectable)]` for opt-in struct and enum type descriptors |
| `reflective-rust-meta` | Stable size/alignment utility and explicit compiler-reflection status boundary |
| `reflective-rust-csg` | Validated CSG exchange schema with mandatory compiler-or-fixture provenance |
| `reflective-rust-agent` | Radius-bounded, access-aware CSG context slices |
| `reflective-rust-conformance` | Golden canonical-hash vectors for the implemented RSP protocol |
| `reflective-rust-bench` | Local measurements without performance claims |
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

Run the repository gates with:

```bash
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --all-targets
python3 scripts/check-structure.py
node scratch/verify-links.mjs
node scripts/gen-llms.mjs
git diff --exit-code -- llms.txt
```

Start with the [implementation status](docs/IMPLEMENTATION_STATUS.md), [conformance record](CONFORMANCE.md), [descriptor protocol](docs/04-runtime/descriptor-protocol.md), [Operational Semantic Graph](docs/04-runtime/operational-semantic-graph.md), and [adoption profiles](docs/08-reference/adoption-profiles.md). The broader language proposal remains in [docs/03-rust-language-proposal](docs/03-rust-language-proposal/README.md).

Licensed under either the MIT License or Apache License 2.0.
