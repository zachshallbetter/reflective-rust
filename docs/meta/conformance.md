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
| `rust-swift` Compiler Workspace | **Tested & Empirically Validated** | `crates/rust-swift-ir` projects into `CompilerSemanticGraph`; verified end-to-end via `crates/reflective-rust-cli/examples/reference_runtime_integration.rs` | Local path dependency and submodule qualification |
| Python Conformance Verifier | **Tested & Empirically Validated** | `scripts/conformance-runner.py` validates JCS hashing and 8 positive/negative vectors independently | Zero external runtime dependencies (Python standard library) |
| Comic OCR runtime 0.2 | Tested locally | Actual runtime crate mapped seven routes into RSP/OSG; access projection and configuration non-disclosure passed | Blocked until a tagged Git revision or registry release exists |
| Infinite Platform | Reviewed mapping only | Existing declarations, database observations, and domain graph boundaries were classified | Blocked by repository issue/claim and approved-branch requirements |
| Titan `fleet-contract` 0.5 | Tested locally | Actual manifest and heartbeat contracts mapped into RSP/OSG; access projection, authority topology, and bounded observation freshness passed; native contract tests pass | Permanent adapter blocked until a tagged Git revision or registry release exists |

## Compiler boundary

`compiler-certified` provenance in `CompilerSemanticGraph` requires cryptographic signature verification (`verify_certification`) against a trusted issuer key ID. Hand-authored fixtures cannot claim certification.

## Release state

`reflective-rust-protocol` and `reflective-rust-csg` package and verify successfully. The workspace maintains normative schemas in `schemas/` and versioned test vectors in `conformance/vectors/`.
