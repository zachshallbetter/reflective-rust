---
title: "Release Management & Verification Protocol"
status: "canonical"
version: "1.0.1"
updated: "2026-08-25"
---

# Reflective Rust Release Management Protocol

> **Status:** Canonical Release Management Guide  
> **Adapted from:** Fundamental Engine `RELEASING.md`  

This document specifies the step-by-step verification, auditing, and tagging protocol for releasing new versions of **Reflective Rust** documentation, compiler specifications, and reference crates.

---

## 1. Pre-Release Verification Checklist

Before tagging or publishing any layer release, run the complete verification gate:

```bash
# 1. Verify link integrity across all documentation files
node scratch/verify-links.mjs

# 2. Verify directory layout and required files
python3 scripts/check-structure.py

# 3. Standardize frontmatter & navigation headers
node scratch/standardize-docs.mjs

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

1. **Verify Conformance Records**: Update `CONFORMANCE.md` declaring exact cross-layer compatibility vectors and consumer evidence.
2. **Update Layer Changelog**: Add release notes, date, and version tag in the target layer's `CHANGELOG.md`.
3. **Rebuild Agent Artifacts**: Execute `node scripts/gen-llms.mjs` to ensure `llms.txt` and `llms-full.txt` reflect the updated corpus.
4. **Publish Runtime Crates in Dependency Order**: publish `reflective-rust-protocol` first, wait until the registry resolves version `0.1.0`, then publish dependent crates individually after `cargo package` verification.
5. **Git Tagging**: Create a signed git tag only after the release commit and package evidence exist:
   - Theory: `spec-v1.0.0`
   - Compiler: `csg-v0.4.0`
   - Runtime: `runtime-v0.1.0`

Never tag or publish a dirty worktree. A local path dependency is qualification evidence only and must not be committed into an independently built consumer repository.
