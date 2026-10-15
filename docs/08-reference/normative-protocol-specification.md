---
title: "Reflective Rust Protocol: Normative Specification v0.1"
scope: "protocol"
status: "canonical"
version: "0.1.0"
updated: "2026-10-14"
summary: "Normative specification for Runtime Semantic Projection (RSP), Compiler Semantic Graph (CSG), and Operational Semantic Graph (OSG) exchange protocols."
---

# Reflective Rust Protocol: Normative Specification v0.1

This document specifies the wire format, canonical serialization, cryptographic authentication, access-level projections, and compatibility contracts for the **Reflective Rust Protocol**.

---

## 1. Architectural Model & Scope

The protocol enables deterministic exchange of semantic graph reflections across compilers, runtimes, agents, and external systems.

Every protocol payload is self-describing, strictly typed, access-partitioned, and verifiable without reliance on language-specific runtime reflection.

```text
┌────────────────────────────────────────────────────────┐
│               AuthenticatedEnvelope                    │
│  - algorithm: "ed25519"                                │
│  - key_id: String                                      │
│  - signature: Base64URL(Ed25519(domain || payload))    │
│  ┌──────────────────────────────────────────────────┐  │
│  │               DescriptorEnvelope                 │  │
│  │  - schema_version: "rr-rsp-0.1"                  │  │
│  │  - subject_id: String                            │  │
│  │  - compatibility: Compatibility                  │  │
│  │  - provenance: Provenance                        │  │
│  │  - minimum_access: AccessLevel                   │  │
│  │  - body: DescriptorBody                          │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

---

## 2. Canonical Serialization & Identity (RFC 8785)

### 2.1 Domain Separation & Identifiers
All hashing and signing operations use strict domain separation to eliminate cross-type collision attacks:

| Artifact | Domain Constant | Identity Representation |
|---|---|---|
| **Source Artifact** | None | `sha256:<hex>` over raw source UTF-8 bytes |
| **Descriptor Body** | None | `sha256:<hex>` over JCS of inner `DescriptorBody` |
| **Complete Envelope** | None | `sha256:<hex>` over JCS of `DescriptorEnvelope` |
| **RSP Signature Payload** | `b"reflective-rust:rsp:ed25519:v1\0"` | `domain || key_id || 0x00 || canonical_envelope_json` |
| **CSG Signature Payload** | `b"reflective-rust:csg:ed25519:v1\0"` | `domain || key_id || 0x00 || content_hash || 0x00 || certified_at` |

### 2.2 JSON Canonicalization Scheme (JCS)
Payloads are canonicalized according to **RFC 8785**:
1. Object keys sorted lexicographically by UTF-16 code units.
2. No unnecessary whitespace (no indentation, no space after `:` or `,`).
3. Standard JSON number and string escape representations.

---

## 3. Provenance & Trust Model

The protocol distinguishes four explicit provenance tiers:

| Tier | Kind | Description | Trust Requirement |
|---|---|---|---|
| **Tier 1** | `compiler-certified` | Produced directly by a verified compiler pass | Must include cryptographic certification (`CompilerCertification`) verified by trusted public key |
| **Tier 2** | `declared` | Synthesized from source annotations or declarations | Authoritative only within declared namespace scope |
| **Tier 3** | `derived` | Derived algorithmically (e.g. OSG derived from runtimes) | Provenance retains computation lineage; cannot claim compiler certification |
| **Tier 4** | `observed` | Point-in-time runtime observation | Requires bounded freshness window (`observed_at` and `expires_at`) |

### 3.1 Non-Circumvention Rule
Hand-authored fixtures and synthetic test cases MUST use `GraphProvenance::Fixture`. A fixture is strictly prohibited from claiming compiler certification; parsers MUST reject any payload where a fixture claims certification.

---

## 4. Access Projection

Every node, field, edge, and capability declares a `minimum_access` level:

```text
public < member < owner < administrator
```

When projecting an envelope for a specific access principal:
1. If `principal_access < envelope.minimum_access`, the envelope is denied (`None`).
2. Fields or variants requiring higher access are stripped without trace.
3. In semantic graphs, edges pointing to or originating from inaccessible nodes are omitted.
4. Projection is pure and deterministic: identical inputs and access tokens produce identical outputs.

---

## 5. Compatibility Verification

Two envelopes are compatible if and only if:
1. `protocol`: Identical schema version (`rr-rsp-0.1`).
2. `subject_schema`: Semantically matching subject schema identifier.

Unknown fields in any message are strictly rejected (`additionalProperties: false`).
