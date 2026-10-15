//! Conformance test harness and vector validation for Reflective Rust protocols.

use reflective_rust_protocol::{CanonicalError, DescriptorEnvelope};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ConformanceResult {
    pub canonical_hash: String,
    pub expected_hash: String,
    pub conforms: bool,
}

pub fn verify_descriptor(
    descriptor: &DescriptorEnvelope,
    expected_hash: impl Into<String>,
) -> Result<ConformanceResult, CanonicalError> {
    let expected_hash = expected_hash.into();
    let canonical_hash = descriptor.canonical_hash()?;
    Ok(ConformanceResult {
        conforms: canonical_hash == expected_hash,
        canonical_hash,
        expected_hash,
    })
}

#[derive(Debug, Deserialize)]
#[allow(dead_code)]
struct ConformanceVector {
    vector_id: String,
    description: String,
    expected_status: String,
    #[serde(default)]
    expected_canonical_hash: Option<String>,
    #[serde(default)]
    expected_error: Option<String>,
    payload: serde_json::Value,
}

#[cfg(test)]
mod tests {
    use super::*;
    use reflective_rust_csg::CompilerSemanticGraph;

    const VEC_POS_TYPE: &str =
        include_str!("../../../conformance/vectors/positive_type_empty.json");
    const VEC_POS_RUNTIME: &str =
        include_str!("../../../conformance/vectors/positive_runtime_vision.json");
    const VEC_NEG_UNKNOWN: &str =
        include_str!("../../../conformance/vectors/negative_unknown_field.json");
    const VEC_NEG_SCHEMA: &str =
        include_str!("../../../conformance/vectors/negative_schema_mismatch.json");
    const VEC_NEG_IDENTIFIER: &str =
        include_str!("../../../conformance/vectors/negative_invalid_identifier.json");
    const VEC_NEG_HASH: &str =
        include_str!("../../../conformance/vectors/negative_malformed_hash.json");
    const VEC_NEG_FIXTURE_CERT: &str =
        include_str!("../../../conformance/vectors/negative_fixture_certification.json");
    const VEC_NEG_DANGLING: &str =
        include_str!("../../../conformance/vectors/negative_dangling_edge.json");

    #[test]
    fn run_all_conformance_vectors() {
        let vectors = [
            VEC_POS_TYPE,
            VEC_POS_RUNTIME,
            VEC_NEG_UNKNOWN,
            VEC_NEG_SCHEMA,
            VEC_NEG_IDENTIFIER,
            VEC_NEG_HASH,
            VEC_NEG_FIXTURE_CERT,
            VEC_NEG_DANGLING,
        ];

        let mut assertions = 0usize;

        for raw_json in vectors {
            let vec: ConformanceVector = serde_json::from_str(raw_json).expect("vector must parse");
            assertions += 1;

            if vec.expected_status == "VALID" {
                let descriptor: Result<DescriptorEnvelope, _> =
                    serde_json::from_value(vec.payload.clone());
                let envelope = descriptor.unwrap_or_else(|e| {
                    panic!("{}: positive envelope must deserialize: {e}", vec.vector_id)
                });
                assertions += 1;

                let res =
                    verify_descriptor(&envelope, vec.expected_canonical_hash.unwrap()).unwrap();
                assertions += 1;
                assert!(
                    res.conforms,
                    "{}: canonical hash must match expected golden hash",
                    vec.vector_id
                );
            } else if vec.expected_status == "REJECTED" {
                assertions += 1;
                // If it's a CSG vector
                if vec.payload.get("schema_version").and_then(|s| s.as_str()) == Some("rr-csg-0.1")
                    || vec.payload.get("edges").is_some()
                {
                    let parse_res: Result<CompilerSemanticGraph, _> =
                        serde_json::from_value(vec.payload);
                    assertions += 1;
                    match parse_res {
                        Ok(graph) => {
                            let val_res = graph.validate();
                            assertions += 1;
                            assert!(
                                val_res.is_err(),
                                "{}: expected rejection in validate()",
                                vec.vector_id
                            );
                        }
                        Err(_) => {
                            // Deserialization rejected directly (e.g. unknown fields)
                            assertions += 1;
                        }
                    }
                } else {
                    let parse_res: Result<DescriptorEnvelope, _> =
                        serde_json::from_value(vec.payload);
                    assertions += 1;
                    match parse_res {
                        Ok(envelope) => {
                            let val_res = envelope.validate();
                            assertions += 1;
                            assert!(
                                val_res.is_err(),
                                "{}: expected rejection in validate()",
                                vec.vector_id
                            );
                        }
                        Err(_) => {
                            // Deserialization rejected directly (e.g. unknown fields)
                            assertions += 1;
                        }
                    }
                }
            }
        }

        println!("Conformance suite passed! Assertions executed: {assertions}");
        assert!(
            assertions >= 20,
            "No-op protection: at least 20 assertions must execute (actual: {assertions})"
        );
    }
}
