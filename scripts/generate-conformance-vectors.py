#!/usr/bin/env python3
"""
Generates normative positive and adversarial negative vectors for Reflective Rust protocol conformance.
"""

import json
import os
import hashlib

def jcs_canonical(obj):
    """Deterministic JSON canonicalization according to RFC 8785."""
    if isinstance(obj, dict):
        items = sorted(obj.items())
        return "{" + ",".join(f"{json.dumps(k)}:{jcs_canonical(v)}" for k, v in items) + "}"
    elif isinstance(obj, list):
        return "[" + ",".join(jcs_canonical(x) for x in obj) + "]"
    elif isinstance(obj, bool):
        return "true" if obj else "false"
    elif obj is None:
        return "null"
    elif isinstance(obj, (int, float)):
        return json.dumps(obj)
    elif isinstance(obj, str):
        return json.dumps(obj)
    else:
        raise TypeError(f"Unhandled type: {type(obj)}")

def sha256_jcs(obj):
    canonical = jcs_canonical(obj)
    return "sha256:" + hashlib.sha256(canonical.encode("utf-8")).hexdigest()

def main():
    out_dir = os.path.join(os.path.dirname(__file__), "..", "conformance", "vectors")
    os.makedirs(out_dir, exist_ok=True)

    # 1. Positive Vector: Empty Struct Type Descriptor
    v1 = {
        "schema_version": "rr-rsp-0.1",
        "subject_id": "rust:type:Empty",
        "compatibility": {
            "protocol": "rr-rsp-0.1",
            "subject_schema": "type-1"
        },
        "provenance": {
            "kind": "derived",
            "authority": "reflective-rust-conformance",
            "source": "vector:empty-type",
            "source_hash": "sha256:503e43da59434586d85f21cb89b94362a54f394a6877f67fdfc60f715a07e924"
        },
        "minimum_access": "public",
        "body": {
            "descriptor_kind": "type",
            "descriptor": {
                "name": "Empty",
                "kind": "struct",
                "fields": [],
                "variants": []
            }
        }
    }
    hash_v1 = sha256_jcs(v1)

    with open(os.path.join(out_dir, "positive_type_empty.json"), "w") as f:
        json.dump({
            "vector_id": "VEC-001-TYPE-EMPTY",
            "description": "Valid empty struct type descriptor envelope",
            "expected_status": "VALID",
            "expected_canonical_hash": hash_v1,
            "payload": v1
        }, f, indent=2)

    # 2. Positive Vector: Runtime Descriptor
    v2 = {
        "schema_version": "rr-rsp-0.1",
        "subject_id": "runtime:vision-runtime",
        "compatibility": {
            "protocol": "rr-rsp-0.1",
            "subject_schema": "runtime-v1"
        },
        "provenance": {
            "kind": "declared",
            "authority": "vision-team",
            "source": "manifest:vision.yaml",
            "source_hash": "sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
        },
        "minimum_access": "public",
        "body": {
            "descriptor_kind": "runtime",
            "descriptor": {
                "name": "vision-runtime",
                "version": "1.0.0",
                "authority_class": "system",
                "capabilities": [
                    {
                        "id": "ocr",
                        "description": "Optical character recognition",
                        "endpoint": "/v1/ocr",
                        "inputs": ["image"],
                        "outputs": ["structured-data"],
                        "streaming": False,
                        "minimum_access": "public"
                    }
                ]
            }
        }
    }
    hash_v2 = sha256_jcs(v2)
    with open(os.path.join(out_dir, "positive_runtime_vision.json"), "w") as f:
        json.dump({
            "vector_id": "VEC-002-RUNTIME-VISION",
            "description": "Valid runtime descriptor envelope with capabilities",
            "expected_status": "VALID",
            "expected_canonical_hash": hash_v2,
            "payload": v2
        }, f, indent=2)

    # 3. Negative Vector: Unknown Field in Envelope
    v_unknown = dict(v1)
    v_unknown["unauthorized_injected_field"] = "malicious_payload"
    with open(os.path.join(out_dir, "negative_unknown_field.json"), "w") as f:
        json.dump({
            "vector_id": "NEG-001-UNKNOWN-FIELD",
            "description": "Envelope containing unauthorized top-level property",
            "expected_status": "REJECTED",
            "expected_error": "unknown_field",
            "payload": v_unknown
        }, f, indent=2)

    # 4. Negative Vector: Protocol Schema Mismatch
    v_schema_mismatch = dict(v1)
    v_schema_mismatch["schema_version"] = "rr-rsp-99.9"
    with open(os.path.join(out_dir, "negative_schema_mismatch.json"), "w") as f:
        json.dump({
            "vector_id": "NEG-002-SCHEMA-MISMATCH",
            "description": "Unsupported protocol schema version",
            "expected_status": "REJECTED",
            "expected_error": "unsupported_schema",
            "payload": v_schema_mismatch
        }, f, indent=2)

    # 5. Negative Vector: Invalid Identifier Characters
    v_bad_id = dict(v1)
    v_bad_id["subject_id"] = "rust:type:Empty; DROP TABLE users;--"
    with open(os.path.join(out_dir, "negative_invalid_identifier.json"), "w") as f:
        json.dump({
            "vector_id": "NEG-003-INVALID-IDENTIFIER",
            "description": "Subject identifier containing forbidden syntax characters",
            "expected_status": "REJECTED",
            "expected_error": "invalid_identifier",
            "payload": v_bad_id
        }, f, indent=2)

    # 6. Negative Vector: Malformed SHA-256 Digest
    v_bad_hash = dict(v1)
    v_bad_hash["provenance"] = dict(v1["provenance"])
    v_bad_hash["provenance"]["source_hash"] = "md5:invalid_digest"
    with open(os.path.join(out_dir, "negative_malformed_hash.json"), "w") as f:
        json.dump({
            "vector_id": "NEG-004-MALFORMED-HASH",
            "description": "Provenance source_hash not conforming to sha256:<64 hex>",
            "expected_status": "REJECTED",
            "expected_error": "malformed_hash",
            "payload": v_bad_hash
        }, f, indent=2)

    # 7. Negative Vector: Fixture Claiming Compiler Certification
    v_csg_forged = {
        "schema_version": "rr-csg-0.1",
        "provenance": {
            "kind": "fixture",
            "source": "forged_fixture.rs"
        },
        "certification": {
            "issuer_key_id": "fake-key",
            "signature": "fake-sig",
            "certified_at": "2026-10-14T00:00:00Z"
        },
        "nodes": [],
        "edges": []
    }
    with open(os.path.join(out_dir, "negative_fixture_certification.json"), "w") as f:
        json.dump({
            "vector_id": "NEG-005-FIXTURE-CERTIFICATION-FORGERY",
            "description": "Fixture provenance attempting to claim compiler certification",
            "expected_status": "REJECTED",
            "expected_error": "fixture_cannot_be_certified",
            "payload": v_csg_forged
        }, f, indent=2)

    # 8. Negative Vector: Dangling Edge in Graph
    v_dangling_edge = {
        "schema_version": "rr-csg-0.1",
        "provenance": {
            "kind": "fixture",
            "source": "test.rs"
        },
        "nodes": [
            {
                "id": "node:a",
                "name": "NodeA",
                "kind": "struct",
                "span": {"file": "test.rs", "start_line": 1, "end_line": 5},
                "minimum_access": "public"
            }
        ],
        "edges": [
            {
                "from": "node:a",
                "to": "node:ghost",
                "relationship": "points_to",
                "minimum_access": "public"
            }
        ]
    }
    with open(os.path.join(out_dir, "negative_dangling_edge.json"), "w") as f:
        json.dump({
            "vector_id": "NEG-006-DANGLING-EDGE",
            "description": "Graph edge referencing non-existent destination node",
            "expected_status": "REJECTED",
            "expected_error": "dangling_edge",
            "payload": v_dangling_edge
        }, f, indent=2)

    print(f"Generated 8 conformance vectors in {out_dir}")

if __name__ == "__main__":
    main()
