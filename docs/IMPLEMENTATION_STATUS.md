---
title: "Implementation Status"
scope: "repository"
status: "canonical"
version: "0.1.0"
updated: "2026-08-25"
summary: "Verified distinction between implemented runtime protocols and proposed compiler reflection."
---
# Implementation Status

The workspace implements a **v0.1 runtime semantic protocol**, not a Rust compiler reflection implementation.

| Capability | Status | Evidence |
| --- | --- | --- |
| Versioned RSP envelopes | Tested | `reflective-rust-protocol` validation and serialization tests |
| Deterministic descriptor identity | Tested | JCS canonicalization, SHA-256 hashing, and a literal golden vector |
| Authenticated envelopes | Tested | Ed25519 signing, trusted key-ID binding, tamper rejection, and key-substitution rejection |
| Provenance classes | Tested | compiler-certified, declared, derived, and observed protocol values |
| Observation freshness | Tested | RFC 3339 parsing, required expiry, body/provenance pairing, invalid-window rejection, and deterministic not-yet-valid/expired rejection |
| Explicit compatibility | Tested | protocol and subject-schema mismatch checks |
| Access projection | Tested | restricted fields, capabilities, nodes, and edges are filtered |
| Operational Semantic Graph | Tested | node uniqueness and dangling-edge validation |
| Opt-in derived type descriptors | Tested | generic structs, tuple/named enum variants, layout, and optional fields |
| CSG exchange model | Tested | schema validation, round trip, and mandatory compiler-or-fixture provenance |
| Access-aware CSG slicing | Tested | radius traversal and access filtering |
| Compiler semantic handles and queries | **Proposed** | specification only; unavailable on stable Rust |
| Compiler CSG extractor | **Not implemented** | no rustc, Cranelift, GCC, or LLVM extractor exists in this workspace |
| Cross-backend compiler conformance | **Not implemented** | runtime descriptor conformance does not substitute for compiler evidence |
| Production HTTP service | **Not implemented** | the server crate is a bounded protocol-discovery example |
| Published performance guarantees | **Not established** | benchmark crate records local measurements only |

Status words are strict:

- **Documented** means a design exists in the research corpus.
- **Implemented** means behavior exists in code.
- **Tested** means an automated check exercises that behavior.
- **Empirically validated** requires a recorded method, environment, data, and reproducible result; no workspace-wide empirical claim is made.

Current repository version: `0.1.0`. The research specification and executable crates remain independently versioned by policy.
