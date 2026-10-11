---
title: "Research Engineering Standards"
scope: "near-term"
status: "canonical"
version: "1.1.0"
updated: "2026-10-11"
summary: "Canonical naming, status honesty, authority hierarchy summary, verification expectations, and concentric scopes for Reflective Rust."
---
# Research Engineering Standards

> **Status:** Canonical  
> Maintained by Zachary Shallbetter

This document states the engineering and research standards that govern work on **Reflective Rust**, the **Compiler Semantic Graph (CSG)**, and related materials in this repository.

---

## 1. System taxonomy and canonical naming

Use this naming stack consistently in code, documentation, and commit messages:

```text
Reflective Rust (Research Program)
  └── Rust Reflective Systems Architecture (RRSA)
      └── Compiler Semantic Graph (CSG)
          ├── Rust Semantic Reflection (Language Subsystem)
          ├── Compile-Time Metaprogramming (Consteval Layer)
          ├── Runtime Semantic Projection (Runtime Subsystem)
          ├── Metaobject Protocols (MOP Layer)
          └── Procedural Reflection Domain (Execution Subsystem)
```

---

## 2. Status honesty (four-tier claim taxonomy)

$$\text{Documented} \neq \text{Implemented} \neq \text{Tested} \neq \text{Empirically Validated}$$

1. **Never conflate maturity levels**
   - A feature specified in an RFC is *documented*, not *implemented*.
   - A function with passing unit tests is *tested*, not *empirically validated*.
   - A benchmark written against the implementation it was designed alongside is a fixture, not an empirical proof. State the weaker claim when in doubt.
2. **Permanent retention of negative results**
   - Abandoned hypotheses and disproven directions are recorded in [`09-research/rejected-designs.md`](../09-research/rejected-designs.md).
   - Do not prune disproven paths solely to tidy the narrative.
3. **Prospective pre-registration**
   - Empirical evaluations and performance claims must define success criteria and invalidation triggers *before* running the measurement. See [`07-research-practices.md`](07-research-practices.md).

---

## 3. Hierarchy of authority

When artifacts conflict, resolve in this order (full table in [`docs/meta/authority.md`](../meta/authority.md)):

$$\text{Research engineering standards \& README} \to \text{Ontology \& glossary} \to \text{Language specification} \to \text{Code / substrate} \to \text{Generated artifacts}$$

- Code and generated artifacts never silently alter theory or language specifications.
- If an implementation deviates from documented architecture, the implementation is defective until a formal update to the specification is recorded.

---

## 4. Layer independence

1. Theory, compiler interfaces, runtime projection adapters, and example crates version independently ([`docs/meta/versioning.md`](../meta/versioning.md)).
2. Cross-layer compatibility is declared in an explicit conformance record ([`docs/meta/conformance.md`](../meta/conformance.md)), never inferred from matching version numbers.
3. Core semantic substrates should remain free of required host dependencies; host integrations are optional adapters.

---

## 5. Verification before merge

```bash
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --all-targets
python3 scripts/check-structure.py
node scratch/verify-links.mjs
```

Additional repository scripts (changelog layer checks, documentation standardization, corpus generation) apply when those surfaces change. Continuous integration must not treat skipped checks as success.

Commit messages use ordinary engineering prose. Do not add tool attribution trailers or session identifiers to tracked history or documentation.

---

## 6. Concentric scopes

| Scope | Focus | Primary locations |
|---|---|---|
| **I — Near-term** | Static semantic reflection and compile-time metaprogramming | `docs/00-foundations/`, `docs/03-rust-language-proposal/`, `docs/08-reference/` |
| **II — Mid-term** | CSG and runtime semantic projection | `docs/04-runtime/`, `docs/05-metaobjects/`, `docs/07-compiler/`, `crates/` |
| **III — Long-term** | Reflective environments and spatial projection research | `docs/06-procedural-reflection/`, `docs/09-research/` |

---

## 7. Generated documentation corpora

`llms.txt` and `llms-full.txt` are **generated** projections of the documentation tree for bulk reading. They are downstream of canonical sources under `docs/` and must not be hand-edited to introduce new claims. Regenerate with `node scripts/gen-llms.mjs` when the corpus generation path is used.

---

## Navigation

[← Research Practices](07-research-practices.md) | [Table of Contents](../SUMMARY.md) | [03 Rust Language Proposal →](../03-rust-language-proposal/README.md)
