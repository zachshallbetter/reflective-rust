//! Stable layout query and the compiler-reflection boundary.
//! Run with: `cargo run --example static_reflection -p reflective-rust-meta`

use reflective_rust_meta::{COMPILER_REFLECTION_STATUS, CompilerReflectionStatus, layout_of};

#[allow(dead_code)]
struct Player {
    id: u64,
    active: bool,
}

fn main() {
    let layout = layout_of::<Player>();
    println!("size={} align={}", layout.size, layout.align);
    println!("compiler_reflection={COMPILER_REFLECTION_STATUS:?}");
    assert_eq!(
        COMPILER_REFLECTION_STATUS,
        CompilerReflectionStatus::Proposed
    );
}
