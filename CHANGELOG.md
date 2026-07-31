# Reflective Rust Changelog

All notable changes to the **Reflective Rust** research program, specifications, and architecture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to independent per-layer versioning.

---

## [1.0.0] - 2026-07-31

### Added
- **Reflective Rust Naming Canon**: Established the official naming hierarchy (Reflective Rust, RRSA, CSG, Rust Semantic Reflection, Runtime Semantic Projection, Procedural Reflection Domain).
- **Hierarchy of Authority (`AUTHORITY.md`)**: Formal resolution rules when theory, language specs, code, or generated artifacts conflict.
- **Verification Gate Scripts**: Ported and integrated `check-structure.py`, `verify-links.mjs`, `standardize-docs.mjs`, and `gen-llms.mjs`.
- **Agent-First Publishing**: Auto-generating `llms.txt` and consolidated `llms-full.txt` (218 KB) for AI agent consumption.
- **Agent Doctrine (`.agents/AGENTS.md`)**: Operational guidelines, claim taxonomy, status honesty rules, and concentric scope staging.
- **Operational Guide (`CLAUDE.md`)**: Developer and AI agent quick-reference map.

### Changed
- Reorganized and elevated document corpus into mdBook-compatible layout under `/Users/zachshallbetter/Projects/reflective-rust/`.
- Standardized YAML frontmatter metadata and bottom navigation bars across all 98 chapter files.
