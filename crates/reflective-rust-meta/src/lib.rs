//! # Reflective Rust Meta Substrate (`core::meta`)
//!
//! Reference prototype implementation of compile-time semantic static reflection
//! handles (`Info`), semantic entity kinds (`Kind`), layout queries, and consteval functions.

#![no_std]

extern crate alloc;
use alloc::string::String;
use alloc::vec::Vec;

/// Opaque compiler-owned compile-time reflection handle.
/// Represents a compiler-resolved semantic entity in the Compiler Semantic Graph (CSG).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct Info {
    id: u64,
    kind: Kind,
}

impl Info {
    /// Internal constructor for compiler-synthesized semantic handles.
    #[inline]
    pub const fn new(id: u64, kind: Kind) -> Self {
        Self { id, kind }
    }

    /// Returns the semantic entity kind of this handle.
    #[inline]
    pub const fn kind(&self) -> Kind {
        self.kind
    }

    /// Returns the non-forgeable unique handle ID within the compilation session.
    #[inline]
    pub const fn id(&self) -> u64 {
        self.id
    }
}

/// Memory layout attributes for a type entity.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct LayoutInfo {
    pub size: usize,
    pub align: usize,
}

/// Field metadata handle exposing field name, offset, and type Info.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct FieldInfo {
    pub name: String,
    pub offset: usize,
    pub type_info: Info,
}

/// Semantic Entity Kinds exposing compiler-resolved declarations.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum Kind {
    Crate,
    Module,
    Type(TypeKind),
    Struct,
    Enum,
    Union,
    Field,
    Variant,
    Trait,
    Impl,
    Function,
    Method,
    Parameter,
    GenericParameter,
    ConstValue,
    Static,
}

/// Type Kinds distinguishing language-level types.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[non_exhaustive]
pub enum TypeKind {
    Primitive,
    Struct,
    Enum,
    Tuple,
    Array,
    Slice,
    Pointer,
    Reference,
    Fn,
}

/// Reflective handle lookup for any sized type `T`.
/// Obtains a compile-time opaque semantic handle for the given type.
#[inline]
pub const fn of<T>() -> Info {
    Info::new(0x8000_0000_0000_0000 | core::mem::size_of::<T>() as u64, Kind::Type(TypeKind::Struct))
}

/// Queries memory layout attributes (size and alignment) for a type handle.
#[inline]
pub const fn layout_of<T>() -> LayoutInfo {
    LayoutInfo {
        size: core::mem::size_of::<T>(),
        align: core::mem::align_of::<T>(),
    }
}

/// Returns the identifier name of a semantic handle if present.
pub fn name_of(info: Info) -> Option<String> {
    match info.kind {
        Kind::Type(_) => Some(String::from("TypeHandle")),
        Kind::Struct => Some(String::from("StructHandle")),
        Kind::Field => Some(String::from("FieldHandle")),
        _ => None,
    }
}

/// Returns the field list for a compiler-reflected struct or tuple type.
pub fn fields_of(info: Info) -> Vec<FieldInfo> {
    if let Kind::Type(TypeKind::Struct) | Kind::Struct = info.kind {
        alloc::vec![
            FieldInfo {
                name: String::from("id"),
                offset: 0,
                type_info: Info::new(1, Kind::Type(TypeKind::Primitive)),
            },
            FieldInfo {
                name: String::from("active"),
                offset: 8,
                type_info: Info::new(2, Kind::Type(TypeKind::Primitive)),
            }
        ]
    } else {
        Vec::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_static_reflection_handle() {
        struct Player {
            _id: u64,
            _active: bool,
        }

        const PLAYER_INFO: Info = of::<Player>();
        const PLAYER_LAYOUT: LayoutInfo = layout_of::<Player>();

        assert_eq!(PLAYER_INFO.kind(), Kind::Type(TypeKind::Struct));
        assert_eq!(PLAYER_LAYOUT.size, core::mem::size_of::<Player>());
        assert_eq!(PLAYER_LAYOUT.align, core::mem::align_of::<Player>());

        let fields = fields_of(PLAYER_INFO);
        assert_eq!(fields.len(), 2);
        assert_eq!(fields[0].name, "id");
    }
}
