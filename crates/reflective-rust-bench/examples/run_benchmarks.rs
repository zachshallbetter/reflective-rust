use reflective_rust_bench::run_measurements;

fn main() {
    let report = run_measurements(10_000);
    println!("iterations={}", report.iterations);
    println!("descriptor_derivation={:?}", report.descriptor_derivation);
    println!("canonical_hashing={:?}", report.canonical_hashing);
}
