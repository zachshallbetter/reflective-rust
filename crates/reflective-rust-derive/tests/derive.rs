use reflective_rust_derive::Reflectable;
use reflective_rust_protocol::{Reflect, TypeKind};

#[derive(Reflectable)]
struct Record<'a, T> {
    id: T,
    borrowed: &'a str,
    label: Option<String>,
}

#[derive(Reflectable)]
#[allow(dead_code)]
enum State {
    Pending,
    Ready { count: u64 },
    Failed(String),
}

#[test]
fn derives_generic_struct_fields_and_layout() {
    let descriptor = Record::<u64>::type_descriptor();
    assert_eq!(descriptor.kind, TypeKind::Struct);
    assert_eq!(descriptor.fields.len(), 3);
    assert!(descriptor.fields[2].optional);
    assert_eq!(
        descriptor.layout.unwrap().size_bytes,
        size_of::<Record<u64>>()
    );
}

#[test]
fn derives_enum_variants_without_claiming_field_offsets() {
    let descriptor = State::type_descriptor();
    assert_eq!(descriptor.kind, TypeKind::Enum);
    assert_eq!(descriptor.variants.len(), 3);
    assert_eq!(descriptor.variants[1].fields[0].name, "count");
    assert_eq!(descriptor.variants[2].fields[0].offset_bytes, None);
}
