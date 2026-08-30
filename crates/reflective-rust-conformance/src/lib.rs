//! Conformance vectors for canonical Runtime Semantic Projection envelopes.

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

#[cfg(test)]
mod tests {
    use super::*;
    use reflective_rust_protocol::{
        AccessLevel, DescriptorBody, ProjectionKind, Provenance, TypeDescriptor, TypeKind,
    };

    fn vector() -> DescriptorEnvelope {
        DescriptorEnvelope::new(
            "rust:type:Empty",
            "type-1",
            Provenance {
                kind: ProjectionKind::Derived,
                authority: "reflective-rust-conformance".into(),
                source: "vector:empty-type".into(),
                source_hash:
                    "sha256:503e43da59434586d85f21cb89b94362a54f394a6877f67fdfc60f715a07e924"
                        .into(),
                observed_at: None,
                expires_at: None,
            },
            AccessLevel::Public,
            DescriptorBody::Type(TypeDescriptor {
                name: "Empty".into(),
                kind: TypeKind::Struct,
                layout: None,
                fields: vec![],
                variants: vec![],
            }),
        )
        .unwrap()
    }

    #[test]
    fn canonical_hash_matches_golden_vector() {
        let descriptor = vector();
        let expected = "sha256:7c98ac356aa59dd29e466c6f6e5927eb5afd2ad85f283d59d920de3f7bf05a18";
        let result = verify_descriptor(&descriptor, expected).unwrap();
        assert!(result.conforms);
        assert_eq!(result.canonical_hash, expected);
    }

    #[test]
    fn changed_expectation_fails_conformance() {
        let result = verify_descriptor(&vector(), "sha256:not-the-vector").unwrap();
        assert!(!result.conforms);
    }
}
