//! Example 01: Static Semantic Reflection (`core::meta`)
//! Run with: `cargo run --example static_reflection -p reflective-rust-meta`

use reflective_rust_meta::{fields_of, layout_of, of, Info, Kind, TypeKind};

#[allow(dead_code)]
struct Player {
    id: u64,
    active: bool,
}

fn main() {
    println!("=== Reflective Rust Example 01: Static Reflection ===");

    // Obtain compile-time opaque handle
    const PLAYER_INFO: Info = of::<Player>();
    let layout = layout_of::<Player>();

    println!("Type Handle ID: 0x{:016X}", PLAYER_INFO.id());
    println!("Entity Kind   : {:?}", PLAYER_INFO.kind());
    println!("Memory Size   : {} bytes", layout.size);
    println!("Alignment     : {} bytes", layout.align);

    // Reflect fields
    let fields = fields_of(PLAYER_INFO);
    println!("\nReflected Struct Fields ({}):", fields.len());
    for field in fields {
        println!("  - Field: {:<10} | Offset: {:<2} bytes | Type: {:?}", field.name, field.offset, field.type_info.kind());
    }

    assert_eq!(PLAYER_INFO.kind(), Kind::Type(TypeKind::Struct));
    println!("\n[OK] Static Reflection Query Succeeded!");
}
