//! Complete reference integration demonstrating end-to-end Runtime Semantic Protocol capabilities.
//!
//! Covers:
//! 1. Declared runtime capabilities and contracts
//! 2. RSP envelope generation, signing, and verification
//! 3. Operational Semantic Graph (OSG) derivation
//! 4. Access-aware semantic slicing
//! 5. Observed runtime state with freshness window
//! 6. Drift detection & intentional mismatch rejection
//! 7. Structured verification receipts

use ed25519_dalek::SigningKey;
use reflective_rust_agent::slice_around;
use reflective_rust_csg::{CompilerSemanticGraph, CsgEdge, CsgNode, CsgNodeKind, SourceSpan};
use reflective_rust_protocol::{
    AccessLevel, CapabilityDescriptor, DescriptorBody, DescriptorEnvelope, Modality,
    ObservationDescriptor, ObservationStatus, OperationalSemanticGraph, ProjectionKind, Provenance,
    RuntimeDescriptor,
};
use serde::{Deserialize, Serialize};
use std::collections::BTreeMap;
use time::OffsetDateTime;

#[derive(Debug, Serialize, Deserialize)]
struct IntegrationReceipt {
    runtime_name: String,
    envelope_hash: String,
    osg_nodes_count: usize,
    osg_edges_count: usize,
    slice_nodes_count: usize,
    drift_detected: bool,
    unauthorized_rejection_verified: bool,
    receipt_timestamp: String,
}

fn main() {
    println!("============================================================");
    println!("Reflective Rust: End-to-End Reference Runtime Integration");
    println!("============================================================");

    // 1. Declare Runtime Capabilities & Contracts
    let runtime = RuntimeDescriptor {
        name: "rust-swift-runtime".into(),
        version: "0.2.0".into(),
        authority_class: "compiler-service".into(),
        capabilities: vec![
            CapabilityDescriptor {
                id: "lower-ast".into(),
                description: "Lowers Rust AST into Semantic Intermediate Representation".into(),
                endpoint: "/v1/lower".into(),
                inputs: vec![Modality::Text],
                outputs: vec![Modality::StructuredData],
                streaming: false,
                minimum_access: AccessLevel::Public,
            },
            CapabilityDescriptor {
                id: "emit-spm-package".into(),
                description: "Synthesizes standalone Swift Package Manager package".into(),
                endpoint: "/v1/emit-spm".into(),
                inputs: vec![Modality::StructuredData],
                outputs: vec![Modality::Binary, Modality::File],
                streaming: false,
                minimum_access: AccessLevel::Member,
            },
            CapabilityDescriptor {
                id: "inspect-memory-layout".into(),
                description: "Internal struct memory alignment and offset diagnostics".into(),
                endpoint: "/v1/internal/layout".into(),
                inputs: vec![Modality::StructuredData],
                outputs: vec![Modality::StructuredData],
                streaming: false,
                minimum_access: AccessLevel::Owner,
            },
        ],
    };

    // 2. Wrap in RSP Descriptor Envelope and Sign
    let source_code = b"pub struct EngineConfig { pub rate: u64 }";
    let source_hash = reflective_rust_protocol::compute_source_hash(source_code);

    let envelope = DescriptorEnvelope::new(
        "runtime:rust-swift-runtime",
        "service-contract-v1",
        Provenance {
            kind: ProjectionKind::Declared,
            authority: "compiler-architecture-team".into(),
            source: "src/engine/runtime.rs".into(),
            source_hash: source_hash.clone(),
            observed_at: None,
            expires_at: None,
        },
        AccessLevel::Public,
        DescriptorBody::Runtime(runtime.clone()),
    )
    .expect("envelope must validate");

    let signing_key = SigningKey::from_bytes(&[42u8; 32]);
    let authenticated = envelope
        .sign("service-key-prod-01", &signing_key)
        .expect("signing must succeed");

    authenticated
        .verify("service-key-prod-01", &signing_key.verifying_key())
        .expect("signature verification must pass");
    println!("1. Authenticated RSP Envelope signed and cryptographically verified.");

    // 3. Derive Operational Semantic Graph (OSG)
    let osg = OperationalSemanticGraph::from_runtime_descriptors(&[(
        runtime.clone(),
        AccessLevel::Public,
    )])
    .expect("OSG derivation must succeed");
    println!(
        "2. Derived OSG topology: {} nodes, {} edges.",
        osg.nodes.len(),
        osg.edges.len()
    );

    // 4. Access-Aware Context Slicing
    let mut csg = CompilerSemanticGraph::fixture("rust-swift-runtime");
    csg.nodes = vec![
        CsgNode {
            id: "svc:rust-swift".into(),
            name: "RustSwiftService".into(),
            kind: CsgNodeKind::Struct,
            span: SourceSpan {
                file: "service.rs".into(),
                start_line: 1,
                end_line: 20,
            },
            minimum_access: AccessLevel::Public,
            size_bytes: None,
        },
        CsgNode {
            id: "cap:emit-spm".into(),
            name: "EmitSPM".into(),
            kind: CsgNodeKind::Function,
            span: SourceSpan {
                file: "spm.rs".into(),
                start_line: 1,
                end_line: 50,
            },
            minimum_access: AccessLevel::Member,
            size_bytes: None,
        },
        CsgNode {
            id: "cap:memory-layout".into(),
            name: "InspectMemoryLayout".into(),
            kind: CsgNodeKind::Function,
            span: SourceSpan {
                file: "layout.rs".into(),
                start_line: 1,
                end_line: 30,
            },
            minimum_access: AccessLevel::Owner,
            size_bytes: None,
        },
    ];
    csg.edges = vec![
        CsgEdge {
            from: "svc:rust-swift".into(),
            to: "cap:emit-spm".into(),
            relationship: "implements".into(),
            minimum_access: AccessLevel::Member,
        },
        CsgEdge {
            from: "svc:rust-swift".into(),
            to: "cap:memory-layout".into(),
            relationship: "implements".into(),
            minimum_access: AccessLevel::Owner,
        },
    ];

    let public_slice = slice_around(&csg, "svc:rust-swift", 2, AccessLevel::Public)
        .expect("slice must succeed")
        .expect("target must exist");
    assert_eq!(
        public_slice.nodes.len(),
        1,
        "Public caller must only see public node"
    );
    assert_eq!(
        public_slice.edges.len(),
        0,
        "Public caller must not see restricted edges"
    );
    println!(
        "3. Access projection verified: Owner & Member capabilities correctly filtered from Public slice."
    );

    // 5. Observed Runtime State with Bounded Freshness Window
    let now = OffsetDateTime::now_utc();
    let expires = now + time::Duration::minutes(5);
    let now_str = now
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap();
    let expires_str = expires
        .format(&time::format_description::well_known::Rfc3339)
        .unwrap();

    let obs_envelope = DescriptorEnvelope::new(
        "obs:rust-swift:latency",
        "metric-v1",
        Provenance {
            kind: ProjectionKind::Observed,
            authority: "telemetry-collector".into(),
            source: "metrics:grpc".into(),
            source_hash: source_hash.clone(),
            observed_at: Some(now_str.clone()),
            expires_at: Some(expires_str),
        },
        AccessLevel::Public,
        DescriptorBody::Observation(ObservationDescriptor {
            target_id: "runtime:rust-swift-runtime".into(),
            status: ObservationStatus::Synchronized,
            facts: {
                let mut f = BTreeMap::new();
                f.insert("p99_latency_micros".into(), serde_json::json!(420.0));
                f
            },
            differences: vec![],
        }),
    )
    .expect("observation envelope must validate");

    obs_envelope
        .require_fresh_at(now + time::Duration::seconds(10))
        .expect("observation must be fresh within window");
    println!("4. Observed runtime metric with bounded freshness validated.");

    // 6. Demonstrate Drift Detection (Source Mismatch)
    let drifted_source = b"pub struct EngineConfig { pub rate: u64, pub drift: bool }";
    let is_valid_source = envelope.validate_source_claim(drifted_source);
    assert!(
        !is_valid_source,
        "Drifted source code must be detected and rejected"
    );
    println!(
        "5. Drift detection verified: Modified source code rejected against canonical source hash."
    );

    // 7. Demonstrate Unauthorized Projection / Key Mismatch
    let wrong_key_result = authenticated.verify("service-key-wrong", &signing_key.verifying_key());
    assert!(
        wrong_key_result.is_err(),
        "Key substitution must be rejected"
    );
    println!("6. Security boundary verified: Unauthorized key substitution rejected.");

    // 8. Generate Evidence Receipt
    let receipt = IntegrationReceipt {
        runtime_name: runtime.name,
        envelope_hash: envelope.canonical_hash().unwrap(),
        osg_nodes_count: osg.nodes.len(),
        osg_edges_count: osg.edges.len(),
        slice_nodes_count: public_slice.nodes.len(),
        drift_detected: !is_valid_source,
        unauthorized_rejection_verified: wrong_key_result.is_err(),
        receipt_timestamp: now_str,
    };

    println!("============================================================");
    println!("Integration Receipt:");
    println!("{}", serde_json::to_string_pretty(&receipt).unwrap());
    println!("============================================================");
    println!("All reference integration verification gates PASSED clean!");
}
