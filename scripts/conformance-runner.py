#!/usr/bin/env python3
"""
Independent Python cross-language conformance validator for Reflective Rust protocol.
Proves interoperability without relying on the Rust binary.
"""

import json
import os
import sys
import glob
import hashlib
import re

SCHEMA_VERSION = "rr-rsp-0.1"
CSG_SCHEMA_VERSION = "rr-csg-0.1"

def jcs_canonical(obj):
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
    return "sha256:" + hashlib.sha256(jcs_canonical(obj).encode("utf-8")).hexdigest()

def validate_identifier(name, val):
    if not isinstance(val, str) or not val.strip():
        return False
    return bool(re.match(r"^[a-zA-Z0-9_.:/-]+$", val))

def validate_envelope(payload):
    allowed_keys = {
        "schema_version", "subject_id", "compatibility",
        "provenance", "minimum_access", "body"
    }
    for k in payload:
        if k not in allowed_keys:
            return False, "unknown_field"
    if payload.get("schema_version") != SCHEMA_VERSION:
        return False, "unsupported_schema"
    if not validate_identifier("subject_id", payload.get("subject_id")):
        return False, "invalid_identifier"
    body = payload.get("body", {})
    if not isinstance(body, dict) or "descriptor_kind" not in body or "descriptor" not in body:
        return False, "invalid_body"
    prov = payload.get("provenance", {})
    sh = prov.get("source_hash", "")
    if not (isinstance(sh, str) and sh.startswith("sha256:") and len(sh) == 71 and all(c in "0123456789abcdef" for c in sh[7:])):
        return False, "malformed_hash"
    return True, None

def validate_csg(payload):
    allowed_keys = {"schema_version", "provenance", "certification", "nodes", "edges"}
    for k in payload:
        if k not in allowed_keys:
            return False, "unknown_field"
    if payload.get("schema_version") != CSG_SCHEMA_VERSION:
        return False, "unsupported_schema"
    prov = payload.get("provenance", {})
    kind = prov.get("kind")
    if kind == "fixture" and payload.get("certification") is not None:
        return False, "fixture_cannot_be_certified"
    node_ids = {n.get("id") for n in payload.get("nodes", [])}
    for edge in payload.get("edges", []):
        if edge.get("from") not in node_ids or edge.get("to") not in node_ids:
            return False, "dangling_edge"
    return True, None

def run_conformance():
    vectors_dir = os.path.join(os.path.dirname(__file__), "..", "conformance", "vectors")
    files = sorted(glob.glob(os.path.join(vectors_dir, "*.json")))
    if not files:
        print(f"ERROR: No vector files found in {vectors_dir}")
        sys.exit(1)

    assertions_executed = 0
    passed = 0
    failed = 0

    print("============================================================")
    print("Reflective Rust Cross-Language Python Conformance Runner")
    print(f"Vector Suite: {len(files)} test vectors")
    print("============================================================")

    for path in files:
        with open(path) as f:
            v = json.load(f)
        vid = v.get("vector_id")
        desc = v.get("description")
        expected = v.get("expected_status")
        payload = v.get("payload")

        if expected == "VALID":
            schema_v = payload.get("schema_version")
            if schema_v == SCHEMA_VERSION:
                valid, err = validate_envelope(payload)
            else:
                valid, err = validate_csg(payload)
            assertions_executed += 1
            if not valid:
                print(f"[FAIL] {vid}: Positive vector failed validation with: {err}")
                failed += 1
                continue

            # Check canonical hash parity
            computed_hash = sha256_jcs(payload)
            expected_hash = v.get("expected_canonical_hash")
            assertions_executed += 1
            if computed_hash != expected_hash:
                print(f"[FAIL] {vid}: Hash mismatch: expected {expected_hash}, got {computed_hash}")
                failed += 1
                continue

            print(f"[PASS] {vid}: {desc} (Hash: {computed_hash[:16]}...)")
            passed += 1

        elif expected == "REJECTED":
            exp_err = v.get("expected_error")
            schema_v = payload.get("schema_version")
            if schema_v == CSG_SCHEMA_VERSION or "edges" in payload:
                valid, err = validate_csg(payload)
            else:
                valid, err = validate_envelope(payload)
            assertions_executed += 1
            if valid:
                print(f"[FAIL] {vid}: Expected rejection ({exp_err}), but payload was accepted!")
                failed += 1
                continue
            assertions_executed += 1
            if err != exp_err:
                print(f"[FAIL] {vid}: Expected error '{exp_err}', but got '{err}'")
                failed += 1
                continue

            print(f"[PASS] {vid}: Rejection verified ({err})")
            passed += 1

    print("============================================================")
    print(f"Results: {passed} passed, {failed} failed | Total Assertions Executed: {assertions_executed}")
    print("============================================================")
    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    run_conformance()
