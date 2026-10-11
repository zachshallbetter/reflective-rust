---
title: "Runtime Protocol Conformance Record"
status: "canonical"
version: "0.1.0"
updated: "2026-08-26"
---

# Runtime Protocol Conformance Record

## Protocol identity

| Layer | Identifier | Implementation |
| --- | --- | --- |
| Runtime Semantic Projection | `rr-rsp-0.1` | `reflective-rust-protocol` 0.1.0 |
| Compiler Semantic Graph exchange | `rr-csg-0.1` | `reflective-rust-csg` 0.1.0 |
| Canonical serialization | JSON Canonicalization Scheme | `serde_jcs` |
| Content identity | `sha256:<lowercase hex>` | SHA-256 over canonical envelope JSON |
| Envelope authentication | `ed25519` | Domain-separated signature over key ID and canonical envelope JSON |

Protocol compatibility and subject-schema compatibility are both exact in
v0.1. A matching content hash is not evidence of compiler, deployment, or
operational equivalence.

## Consumer evidence

| Consumer | Status | Evidence | Permanent dependency |
| --- | --- | --- | --- |
| Comic OCR runtime 0.2 | Tested locally | Actual runtime crate mapped seven routes into RSP/OSG; access projection and configuration non-disclosure passed | Blocked until a tagged Git revision or registry release exists |
| Infinite Platform | Reviewed mapping only | Existing declarations, database observations, and domain graph boundaries were classified | Blocked by repository issue/claim and approved-branch requirements |
| Titan `fleet-contract` 0.5 | Tested locally | Actual manifest and heartbeat contracts mapped into RSP/OSG; access projection, authority topology, and bounded observation freshness passed; native contract tests pass | Permanent adapter blocked until a tagged Git revision or registry release exists |

## Compiler boundary

No compiler extractor exists. No value in this record establishes rustc, LLVM,
Cranelift, or GCC conformance. `compiler-certified` provenance becomes trusted
only after an identified extractor signs an envelope and the consumer verifies
it against a separately trusted public key.

## Release state

`reflective-rust-protocol` packages and verifies successfully with
`cargo package -p reflective-rust-protocol --allow-dirty`. The workspace has not
been committed, tagged, pushed, or published. Consumer repositories must not add
a crates.io dependency until publication succeeds.
