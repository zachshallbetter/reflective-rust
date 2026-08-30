//! Runtime descriptor registry example.
//! Run with: `cargo run --example ecs_component_engine -p reflective-rust-derive`

use reflective_rust_derive::Reflectable;
use reflective_rust_protocol::{Reflect, TypeDescriptor};
use std::collections::BTreeMap;

#[derive(Reflectable)]
#[allow(dead_code)]
struct Position {
    x: f32,
    y: f32,
    z: f32,
}

fn main() {
    let descriptor = Position::type_descriptor();
    let mut registry: BTreeMap<String, TypeDescriptor> = BTreeMap::new();
    registry.insert(descriptor.name.clone(), descriptor);
    println!("registered {} runtime descriptor", registry.len());
}
