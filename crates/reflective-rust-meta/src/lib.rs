//! Stable-Rust boundary for the proposed compiler reflection substrate.
//!
//! Rust does not currently expose the compiler-owned semantic handles proposed
//! by Reflective Rust. This crate therefore provides only ordinary layout facts
//! that stable Rust can compute without pretending to expose compiler metadata.

#![no_std]

/// Memory layout available through stable `core::mem` APIs.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct LayoutInfo {
    pub size: usize,
    pub align: usize,
}

/// Current implementation status of compiler semantic reflection.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CompilerReflectionStatus {
    /// Specified by the research proposal but not implemented by this workspace.
    Proposed,
}

pub const COMPILER_REFLECTION_STATUS: CompilerReflectionStatus = CompilerReflectionStatus::Proposed;

/// Returns the stable-Rust size and alignment of `T`.
#[inline]
pub const fn layout_of<T>() -> LayoutInfo {
    LayoutInfo {
        size: core::mem::size_of::<T>(),
        align: core::mem::align_of::<T>(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn reports_only_stable_layout_facts() {
        type Sample = (u64, bool);

        let layout = layout_of::<Sample>();
        assert_eq!(layout.size, core::mem::size_of::<Sample>());
        assert_eq!(layout.align, core::mem::align_of::<Sample>());
        assert_eq!(
            COMPILER_REFLECTION_STATUS,
            CompilerReflectionStatus::Proposed
        );
    }
}
