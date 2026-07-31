//! Real-World Industrial Example: Entity-Component-System (ECS) Dynamic Component Engine
//! Run with: `cargo run --example ecs_component_engine -p reflective-rust-derive`

use reflective_rust_derive::Reflectable;
use std::collections::HashMap;

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
struct PositionComponent {
    x: f32,
    y: f32,
    z: f32,
}

#[derive(Reflectable)]
#[allow(dead_code)]
struct VelocityComponent {
    vx: f32,
    vy: f32,
    vz: f32,
}

pub struct EcsRegistry {
    descriptors: HashMap<&'static str, &'static TypeDescriptor>,
}

impl EcsRegistry {
    pub fn new() -> Self {
        Self { descriptors: HashMap::new() }
    }

    pub fn register_component(&mut self, descriptor: &'static TypeDescriptor) {
        self.descriptors.insert(descriptor.name, descriptor);
    }

    pub fn inspect_registered(&self) {
        println!("Registered ECS Component Types ({}):", self.descriptors.len());
        for (name, desc) in &self.descriptors {
            println!("  - Component: {:<20} | Memory Size: {} bytes | Fields: {}", name, desc.size, desc.fields.len());
            for field in desc.fields {
                println!("      └─ Field: {:<6} (type: {}) at offset {}", field.name, field.type_name, field.offset);
            }
        }
    }
}

fn main() {
    println!("=== Real-World Industrial Example: ECS Dynamic Component Engine ===");

    let mut registry = EcsRegistry::new();

    // Automatically register components using opt-in reflectable VTables
    registry.register_component(PositionComponent::type_descriptor());
    registry.register_component(VelocityComponent::type_descriptor());

    registry.inspect_registered();

    assert_eq!(registry.descriptors.len(), 2);
    println!("\n✓ Dynamic ECS Component Registry Initialization Succeeded!");
}
