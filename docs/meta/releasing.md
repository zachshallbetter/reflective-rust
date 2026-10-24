---
title: "Release Management & Verification Protocol"
status: "canonical"
version: "1.0.2"
updated: "2026-10-22"
---

# Reflective Rust Release Management Protocol

> **Status:** Canonical Release Management Guide  
> **Adapted from:** Fundamental Engine `RELEASING.md`  

This document specifies the step-by-step verification, auditing, and tagging protocol for releasing new versions of **Reflective Rust** documentation, compiler specifications, and reference crates.

---

## 1. Pre-Release Verification Checklist

Before tagging or publishing a workspace release, run the complete verification gate from a clean checkout. Do not run the frontmatter standardizer as a routine release step unless you intend to review and commit all of its changes:

```bash
# 1. Verify link integrity across all documentation files
node scratch/verify-links.mjs

# 2. Verify directory layout and required files
python3 scripts/check-structure.py

# 4. Check layer changelog diffs
python3 scripts/check-changelogs.py

# 5. Rebuild agent-first single-file context corpus
node scripts/gen-llms.mjs

# 6. Verify executable crates
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --all-targets --locked

# 7. Verify the publishable protocol package
cargo package -p reflective-rust-protocol
```

---

## 2. Release Steps

1. **Verify Conformance Records**: Update `docs/meta/conformance.md` declaring exact cross-layer compatibility vectors and consumer evidence.
2. **Update the repository changelog**: Add an accurate entry to the root `CHANGELOG.md` under `[Unreleased]`. Separate per-layer changelog files are not currently maintained.
3. **Rebuild Agent Artifacts**: Execute `node scripts/gen-llms.mjs` to ensure `llms.txt` and `llms-full.txt` reflect the updated corpus.
4. **Package-check the workspace version**: the current workspace version is `0.2.0`; do not assume a crate is published just because it has a Cargo version. Before any registry publication, inspect each crate's dependency metadata, confirm all path dependencies are publishable/resolvable, and verify the exact package with `cargo package --locked -p <crate>`.
5. **Git Tagging**: Create a signed git tag only after the release commit and package evidence exist:
   - Use a release tag only for a release artifact that has an explicit versioning and validation record. Do not create theory/compiler/runtime release tags merely because example names or frontmatter contain version numbers.

Never tag or publish a dirty worktree. A local path dependency is qualification evidence only and must not be committed into an independently built consumer repository.
