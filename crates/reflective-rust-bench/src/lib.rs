//! Repeatable local measurements for implemented descriptor operations.
//!
//! Results are measurements, not performance guarantees.

use reflective_rust_derive::Reflectable;
use reflective_rust_protocol::{
    AccessLevel, DescriptorBody, DescriptorEnvelope, ProjectionKind, Provenance, Reflect,
};
use std::hint::black_box;
use std::time::{Duration, Instant};

#[derive(Reflectable)]
#[allow(dead_code)]
struct BenchmarkTarget {
    id: u64,
    label: Option<String>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct BenchmarkReport {
    pub iterations: usize,
    pub descriptor_derivation: Duration,
    pub canonical_hashing: Duration,
}

pub fn run_measurements(iterations: usize) -> BenchmarkReport {
    let iterations = iterations.max(1);
    let started = Instant::now();
    for _ in 0..iterations {
        black_box(BenchmarkTarget::type_descriptor());
    }
    let descriptor_derivation = started.elapsed();

    let envelope = DescriptorEnvelope::new(
        "rust:type:BenchmarkTarget",
        "benchmark-type-1",
        Provenance {
            kind: ProjectionKind::Derived,
            authority: "reflective-rust-bench".into(),
            source: "derive:BenchmarkTarget".into(),
            source_hash: "sha256:5460909ab229020778cb1e9fef972bdc333751319e96142c08ea92b64a0fd262"
                .into(),
            observed_at: None,
            expires_at: None,
        },
        AccessLevel::Public,
        DescriptorBody::Type(BenchmarkTarget::type_descriptor()),
    )
    .expect("benchmark fixture must be valid");
    let started = Instant::now();
    for _ in 0..iterations {
        black_box(
            envelope
                .canonical_hash()
                .expect("benchmark fixture must hash"),
        );
    }
    let canonical_hashing = started.elapsed();

    BenchmarkReport {
        iterations,
        descriptor_derivation,
        canonical_hashing,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn zero_iterations_still_produces_a_measurement() {
        assert_eq!(run_measurements(0).iterations, 1);
    }
}
