---
title: "Adoption Profiles"
scope: "reference"
status: "canonical"
version: "0.1.0"
updated: "2026-08-25"
summary: "Boundary mappings for Comic OCR, Infinite Platform, and Titan Systems."
---
# Adoption Profiles

Reflective Rust is an exchange layer around existing contracts, not a replacement system of record. Adapters preserve each project's canonical schema and identify the transformation in envelope provenance.

## Comic OCR

| Existing concern | Reflective Rust projection |
| --- | --- |
| OCR and localized-text JSON schemas | declared or derived RSP type descriptors |
| OCR/model service input and output contract | RSP runtime and capability descriptors |
| Actual schema-validation or model result | observed descriptor linked to the declared target |
| Comic scene graph | remains a Comic OCR domain graph; it is not renamed CSG or OSG |
| OCR service/provider topology | derived OSG nodes and dependency edges |

Schema URLs, model identifiers, and source revisions belong in compatibility and provenance. Image contents, extracted text, and full model payloads do not belong in general descriptor metadata.

## Infinite Platform

| Existing concern | Reflective Rust projection |
| --- | --- |
| Application-owned type or capability declarations | declared RSP descriptors |
| Live database schema inspection | observed descriptors with observation time and source hash |
| Difference between intended and live schema | observation `differences`, never silent mutation of the declaration |
| Services, databases, providers, and capability routes | OSG topology |
| Existing domain semantic graphs | retain their domain names unless they specifically represent compiler or operational semantics |

Database observations must redact values and credentials. The projection records schema facts required for compatibility; it does not retain table contents.

## Titan Systems

| Existing concern | Reflective Rust projection |
| --- | --- |
| `fleet-contract` runtime manifest | declared RSP runtime descriptor |
| Manifest capability | RSP capability descriptor |
| Generated fleet topology | derived OSG |
| Runtime heartbeat | observed descriptor with expiry |
| Plane, authority tier, exposure, credential class, and data class | typed contract fields in the owning Titan schema; projected only through explicit adapter mappings |
| Contract drift | observation targeting the declared runtime or capability identity |

Titan's fleet contract remains authoritative. Reflective Rust must not introduce a second manifest shape inside Titan, infer authority from connectivity, or merge heartbeat state into declared configuration. Public OSG projection must remove restricted nodes and all incident edges.

## Adapter rule

Each adapter is a pure transformation from one versioned source value to one RSP envelope. The adapter records source identity and source hash, validates the result, and performs no network or database side effects. Live collection and storage remain outside the protocol crate.

---

## Navigation
[← Implementation Status](../IMPLEMENTATION_STATUS.md) | [Table of Contents](../SUMMARY.md) | [Proposed API →](proposed-api.md)
