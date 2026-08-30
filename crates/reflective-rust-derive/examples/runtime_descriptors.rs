//! Opt-in runtime type descriptors.
//! Run with: `cargo run --example runtime_descriptors -p reflective-rust-derive`

use reflective_rust_derive::Reflectable;
use reflective_rust_protocol::Reflect;

#[derive(Reflectable)]
#[allow(dead_code)]
struct PlayerAccount {
    id: u64,
    score: u32,
    nickname: Option<String>,
}

fn main() {
    let descriptor = PlayerAccount::type_descriptor();
    println!("{}: {} fields", descriptor.name, descriptor.fields.len());
    for field in descriptor.fields {
        println!(
            "{}: {} at {:?}",
            field.name, field.type_name, field.offset_bytes
        );
    }
}
