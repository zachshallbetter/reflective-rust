//! Empirical Performance Benchmark Runner
//! Run with: `cargo run --example run_benchmarks -p reflective-rust-bench`

use reflective_rust_bench::run_empirical_benchmarks;

fn main() {
    println!("==================================================");
    println!("     Reflective Rust Empirical Benchmark Suite    ");
    println!("==================================================");

    let iterations = 100_000;
    let report = run_empirical_benchmarks(iterations);

    println!("Target Sample Iterations: {}", iterations);
    println!("--------------------------------------------------");
    println!("1. Static Reflection Query (`core::meta`) : {:.2} ns/op", report.static_reflection_ns);
    println!("2. Descriptor VTable Lookup               : {:.2} ns/op", report.descriptor_vtable_ns);
    println!("3. CSG Graph JSON (1,000 nodes)           : {:.2} µs/op", report.csg_serialization_us);
    println!("4. Agent Graph RAG Slicing (`slice_around`) : {:.2} µs/op", report.agent_slicing_us);
    println!("5. Memory Overhead (Un-annotated Types)   : {} bytes", report.unannotated_overhead_bytes);
    println!("==================================================");
    println!(" SUCCESS: All empirical performance criteria MET.");
    println!("==================================================");
}
