---
title: "Layer Versioning Policy"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
---

# Reflective Rust Layer Versioning Policy

> **Status:** Canonical Versioning Specification  
> **Adapted from:** Fundamental Engine & FCI Independent Layer Versioning Policy  

Reflective Rust versions theory, compiler specifications, runtime projection adapters, procedural reflection execution domains, spatial projections, and reference implementations **independently**. A shared version number **never** implies cross-layer conformance.

---

## 1. The Independent Layer Model

```text
Layer 1: Theory & Core Architecture (docs/00-foundations/, docs/03-rust-language-proposal/)
    ├── Independent Versioning: v1.0.0 (SemVer for Language Spec)
    └── Changelog: docs/CHANGELOG.md

Layer 2: Compiler Semantic Graph & Compiler Integrations (docs/07-compiler/)
    ├── Independent Versioning: v0.4.0 (Compiler Interface Version)
    └── Changelog: docs/07-compiler/CHANGELOG.md

Layer 3: Runtime Semantic Projection Adapters (docs/04-runtime/)
    ├── Independent Versioning: v0.2.1 (Runtime Descriptor Crate)
    └── Changelog: docs/04-runtime/CHANGELOG.md

Layer 4: Spatial & AI Tooling Projections (docs/09-research/, docs/06-procedural-reflection/)
    ├── Independent Versioning: v0.1.0 (SSP / AI Integration Specs)
    └── Changelog: docs/09-research/CHANGELOG.md
```

---

## 2. Load-Bearing Policy Rules

1. **No Silent Version Coupling**:
   - A patch or clarification to the language specification (Layer 1) does **not** force a release bump in runtime projection crates (Layer 3).
   - A performance fix in a compiler backend (Layer 2) does **not** imply a new theory specification version.
2. **Explicit Conformance Records**:
   - Cross-layer compatibility must be declared in an explicit **Conformance Record** (`CONFORMANCE.md` or [`docs/08-reference/comparison-matrix.md`](docs/08-reference/comparison-matrix.md))—never inferred from matching version numbers.
3. **Per-Layer Changelogs**:
   - Each layer maintains its own changelog. A single repo-wide changelog would assert exactly the version coupling this policy denies.
4. **CI Enforcement**:
   - CI workflows inspect the **diff** of changed files against per-layer changelogs (`scripts/check-changelogs.py`). Pull requests touching a layer without updating that layer's changelog fail CI.
