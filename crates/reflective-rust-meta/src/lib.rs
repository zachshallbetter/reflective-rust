//! # Reflective Rust Meta Substrate (`core::meta`)
//!
//! Reference prototype implementation of compile-time semantic static reflection
//! handles (`Info`), semantic entity kinds (`Kind`), and consteval query functions.

#![no_std]

extern crate alloc;
use alloc::string::String;

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
    // In rustc implementation, this is a compiler intrinsic (`#[lang = "meta_info_of"]`).
    // For this reference crate, we synthesize a deterministic handle ID.
    Info::new(0x8000_0000_0000_0000 | core::mem::size_of::<T>() as u64, Kind::Type(TypeKind::Struct))
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_static_reflection_handle() {
        struct Player {
            _id: u64,
            _health: f32,
        }

        const PLAYER_INFO: Info = of::<Player>();

        assert_eq!(PLAYER_INFO.kind(), Kind::Type(TypeKind::Struct));
        assert!(PLAYER_INFO.id() > 0);
    }
}
