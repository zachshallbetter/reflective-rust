//! Example: Opt-in Runtime Descriptors via `#[derive(Reflectable)]`
//! Run with: `cargo run --example runtime_descriptors -p reflective-rust-derive`

use reflective_rust_derive::Reflectable;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct FieldDescriptor {
    pub name: &'static str,
    pub offset: usize,
    pub type_name: &'static str,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct TypeDescriptor {
    pub name: &'static str,
    pub size: usize,
    pub align: usize,
    pub fields: &'static [FieldDescriptor],
}

#[derive(Reflectable)]
#[allow(dead_code)]
struct PlayerAccount {
    id: u64,
    score: u32,
    is_admin: bool,
}

fn main() {
    println!("=== Reflective Rust Example: Runtime Type Descriptors ===");

    let descriptor: &'static TypeDescriptor = PlayerAccount::type_descriptor();

    println!("Type Descriptor VTable for struct '{}':", descriptor.name);
    println!("  - Size     : {} bytes", descriptor.size);
    println!("  - Alignment: {} bytes", descriptor.align);
    println!("  - Fields ({}) :", descriptor.fields.len());

    for field in descriptor.fields {
        println!(
            "      └─ field {:<10} (type: {:<8}) offset {}",
            field.name, field.type_name, field.offset
        );
    }

    assert_eq!(descriptor.name, "PlayerAccount");
    assert_eq!(descriptor.fields.len(), 3);
    println!("\n[OK] Opt-In Runtime Descriptor VTable Introspection Succeeded!");
}
