---
title: "Runtime Semantic Projection Protocol"
scope: "mid-term"
status: "canonical"
version: "0.1.0"
updated: "2026-08-25"
summary: "Canonical envelope, provenance, access, compatibility, validation, and identity rules for runtime descriptors."
---
# Runtime Semantic Projection Protocol

Runtime Semantic Projection (RSP) is the portable contract emitted or assembled for runtime consumers. It is distinct from compiler reflection: an RSP may be derived by a macro, declared by an application, or observed from a live system without becoming a compiler-certified fact.

Every descriptor uses one envelope shape:

| Field | Meaning |
| --- | --- |
| `schema_version` | Protocol schema, currently `rr-rsp-0.1` |
| `subject_id` | Stable identity chosen by the subject authority |
| `compatibility` | Protocol and subject-schema versions |
| `provenance` | Epistemic class, authority, source, source hash, and observation freshness window when applicable |
| `minimum_access` | Lowest access class permitted to receive the descriptor |
| `body` | Type, runtime, observation, or OSG descriptor |

## Provenance classes

- `compiler-certified`: emitted by an identified compiler integration from compiler-resolved facts.
- `declared`: asserted by the authority that owns the runtime contract.
- `derived`: mechanically projected from another identified source.
- `observed`: measured from a running system and bounded by observation time or expiry when relevant.

Consumers must not promote one class into another. In particular, macro-derived layout data and hand-authored manifests are not compiler-certified.

Unsigned provenance is an assertion, not proof. `AuthenticatedEnvelope` binds the canonical envelope and expected key identifier with an Ed25519 signature. Verification requires a trusted public key supplied outside the envelope; accepting the key carried alongside untrusted content would only authenticate the attacker to itself.

Observed envelopes must contain an observation body plus RFC 3339 `observed_at` and `expires_at` timestamps, with expiry later than observation. Consumers call `require_fresh_at` with their trusted current time and reject observations before their observation time or at and after expiry. The record may be retained after expiry, but it must no longer drive current-state decisions. Declared, derived, and compiler-certified envelopes cannot carry observation timestamps.

## Identity and compatibility

Identity uses RFC 8785-style JSON Canonicalization Scheme serialization followed by SHA-256, rendered as `sha256:<lowercase hex>`. Unknown fields are rejected on protocol records. Collections with semantic identifiers reject duplicates, and graph edges must resolve.

A matching hash means matching canonical content under the same schema. It does not, by itself, prove compiler, deployment, or operational equivalence.

Compatibility is checked independently from identity. Both protocol version and subject-schema version must match before two envelopes are treated as interchangeable.

## Access projection

Access classes are ordered `public < member < owner < administrator`. Projection removes inaccessible members before serialization and removes graph edges whose endpoints are no longer visible. Authorization remains the serving system's responsibility; projection is a disclosure-minimization mechanism, not authentication.
