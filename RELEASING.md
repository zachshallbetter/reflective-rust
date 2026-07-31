---
title: "Release Management & Verification Protocol"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
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
```

---

## 2. Release Steps

1. **Verify Conformance Records**: Update `CONFORMANCE.md` declaring exact cross-layer compatibility vectors.
2. **Update Layer Changelog**: Add release notes, date, and version tag in the target layer's `CHANGELOG.md`.
3. **Rebuild Agent Artifacts**: Execute `node scripts/gen-llms.mjs` to ensure `llms.txt` and `llms-full.txt` reflect the updated corpus.
4. **Git Tagging**: Create a signed git tag using layer-namespaced SemVer tags:
   - Theory: `spec-v1.0.0`
   - Compiler: `csg-v0.4.0`
   - Runtime: `runtime-v0.2.1`
