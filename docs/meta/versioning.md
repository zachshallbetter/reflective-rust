---
title: "Layer Versioning Policy"
status: "canonical"
version: "1.0.2"
updated: "2026-10-22"
---

# Reflective Rust Versioning Policy

Reflective Rust contains several version axes. They must be stated explicitly and must not be treated as interchangeable.

## Version axes

| Version axis | Current value | Meaning |
| --- | --- | --- |
| Cargo workspace/crate version | `0.2.0` | Version of the executable Rust reference workspace |
| Runtime Semantic Projection schema | `rr-rsp-0.1` | Versioned runtime envelope/schema contract |
| Compiler Semantic Graph exchange schema | `rr-csg-0.1` | Versioned graph exchange contract |
| Research-document frontmatter | Per-document metadata | Editorial revision metadata; not a package or protocol release |
| Public GitHub releases | See [GitHub Releases](https://github.com/zachshallbetter/reflective-rust/releases) | Published repository release tags and their release notes |

A matching version number does not imply cross-layer conformance. Protocol identifiers may remain stable across a Cargo package release; a workspace release does not mean that proposed compiler facilities have been implemented.

## Changelog policy

The repository currently maintains a single root `CHANGELOG.md`. It records repository-level changes and is the changelog checked by CI for documentation changes. There are **not currently separate per-layer changelog files** in the repository tree.

For a change under `docs/`, update the root changelog's `[Unreleased]` section. For code changes, update it when behavior, public interfaces, protocol semantics, or user-facing workflows change. Do not describe a proposed feature as implemented merely because its specification has changed.

## Conformance policy

Cross-layer compatibility must be recorded in [the conformance record](conformance.md) and supported by reproducible evidence. Distinguish repository-local tests from maintainer-reported tests of external consumers. Never infer compiler, deployment, or operational equivalence from a matching version or content hash.

The root Cargo workspace version tracks the executable reference implementation only. It does not assert implementation of the independently proposed language or compiler facilities.
