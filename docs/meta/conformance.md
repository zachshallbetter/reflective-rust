---
title: "Runtime Protocol Conformance Record"
status: "canonical"
version: "0.1.1"
updated: "2026-10-22"
---

# Runtime Protocol Conformance Record

## Protocol identity

| Layer | Identifier | Implementation |
| --- | --- | --- |
| Runtime Semantic Projection | `rr-rsp-0.1` | `reflective-rust-protocol` 0.2.0 |
| Compiler Semantic Graph exchange | `rr-csg-0.1` | `reflective-rust-csg` 0.2.0 |
| Canonical serialization | JSON Canonicalization Scheme | `serde_jcs` |
| Content identity | `sha256:<lowercase hex>` | SHA-256 over canonical envelope JSON |
| Envelope authentication | `ed25519` | Domain-separated signature over key ID and canonical envelope JSON |

The `rr-rsp-0.1` and `rr-csg-0.1` identifiers describe protocol/schema versions; they are independent of the Cargo workspace version (`0.2.0`). Protocol and subject-schema compatibility are exact within `v0.1`. A matching content hash is not evidence of compiler, deployment, or operational equivalence.

## Consumer evidence

| Consumer | Status | Evidence | Permanent dependency |
| --- | --- | --- | --- |
| `rust-swift` Compiler Workspace (external consumer) | Maintainer-reported end-to-end test | `crates/rust-swift-ir` is outside this repository; integration evidence is not reproducible from this checkout | Local path dependency and submodule qualification |
| Python Conformance Verifier | Tested | `scripts/conformance-runner.py` checks JCS hashing and the repository's positive/negative vectors independently | Python standard library |
| Comic OCR runtime 0.2 (external consumer) | Maintainer-reported local test | Consumer source and raw test evidence are not included in this repository | Blocked until a tagged Git revision or registry release exists |
| Infinite Platform (external consumer) | Reviewed mapping only; maintainer-reported | Consumer source and review artifacts are not included in this repository | Blocked by repository issue/claim and approved-branch requirements |
| Titan `fleet-contract` 0.5 (external consumer) | Maintainer-reported local test | Consumer source and raw test evidence are not included in this repository | Permanent adapter blocked until a tagged Git revision or registry release exists |

## Compiler boundary

`compiler-certified` provenance in `CompilerSemanticGraph` requires cryptographic signature verification (`verify_certification`) against a trusted issuer key ID. Hand-authored fixtures cannot claim certification.

## Release state

The current workspace CI verifies the code and tests. The repository maintains normative schemas in `schemas/` and versioned test vectors in `conformance/vectors/`. Consumer rows above are external maintainer reports unless their evidence is checked into this repository.
