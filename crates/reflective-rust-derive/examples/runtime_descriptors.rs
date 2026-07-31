//! Example 02: Opt-In Zero-Cost Runtime Descriptors (`#[derive(Reflectable)]`)
//! Run with: `cargo run --example runtime_descriptors -p reflective-rust-derive`

use reflective_rust_derive::Reflectable;

#[derive(Reflectable)]
#[allow(dead_code)]
struct GameEntity {
    id: u64,
    health: f32,
    score: u32,
}

fn main() {
    println!("=== Reflective Rust Example 02: Runtime Descriptors ===");

    // Obtain opt-in static descriptor VTable emitted by #[derive(Reflectable)]
    let descriptor = GameEntity::type_descriptor();

    println!("Type Name   : {}", descriptor.name);
    println!("Memory Size : {} bytes", descriptor.size);
    println!("Alignment   : {} bytes", descriptor.align);

    println!("\nReflected Field VTable Descriptors ({}):", descriptor.fields.len());
    for field in descriptor.fields {
        println!("  - Field: {:<10} | Byte Offset: {:<2} | Type: {}", field.name, field.offset, field.type_name);
    }

    assert_eq!(descriptor.name, "GameEntity");
    assert_eq!(descriptor.fields.len(), 3);
    println!("\n✓ Opt-In Runtime Descriptor VTable Query Succeeded!");
}
