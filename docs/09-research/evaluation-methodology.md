---
title: "Evaluation Methodology"
scope: "long-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Evaluation Methodology under Scope III: Long-Term (Reflective Environments, AI Tooling & Spatial Projection)."
---
# Evaluation Methodology

**Status:** Research synthesis

## 29. Evaluation methodology

| Area | Tests | Success criterion |
|---|---|---|
| Semantic correctness | aliases, generics, associated types, opaque types, ambiguity | no silent collapse of ambiguity or unavailability |
| Phase discipline | premature layout/body/instance queries | deterministic phase-specific diagnostics |
| Privacy | module, sibling, dependency, re-export, owner projection | inaccessible entities produce no handles or metadata |
| Coherence | foreign/foreign, overlap, blanket, unsafe impls | same result as handwritten source |
| Snapshot staging | self-producing and mutually producing declarations | same-stage cycles rejected |
| Incremental compilation | visible/hidden field, attribute, target, generator changes | only actual dependencies invalidate |
| Reproducibility | repeated/parallel builds, changed host environment | identical semantic output/fingerprints |
| Resource bounds | recursion, allocation, solver explosion, output explosion | bounded termination with causal diagnostics |
| Runtime soundness | wrong key/receiver, alias conflict, panic, destructor | Miri and compile-fail suites find no safe UB |
| Registry | LTO, dead stripping, platforms, duplicates | reachable entries retained once |
| Zero-cost baseline | unused reflection library | no descriptor, section, or thunk remains |
| Performance | handwritten vs generated static vs dynamic | static path near handwritten within set tolerance |
| Code size | per-type/capability measurement | cost proportional and attributable |
| Procedural safety | pinning, live borrows, partial initialization, drops | unsafe transitions unrepresentable safely |
| Procedural fidelity | inspect, mutate certified local, resume, abort | state is causally connected at documented safepoints |

### 29.1 Privacy conformance example

```rust
// dependency crate
pub struct Account {
    id: u64,
    secret: Secret,
}

// downstream crate
const INFO: TypeInfo = reflect_runtime::project_public::<Account>();
```

Required result:

- `Account` may be discoverable;
- no `secret` field name is returned;
- no type identity for `Secret` is returned;
- no private-field count reveals its presence;
- no getter, offset, source location, or private attribute is emitted.

### 29.2 Zero-cost conformance example

Compare a baseline build with one linking the reflection runtime but never projecting a type. Required result after normal nondeterminism normalization:

- no reflection section;
- no `Player` descriptor;
- no invocation thunk;
- no reachable registry machinery.

### 29.3 Procedural conformance example

```rust
#[reflectable]
async fn transfer(mut balance: u64) -> Result<(), Error> {
    reflect_point!("before-debit");
    balance -= 10;
    commit(balance).await
}
```

At `before-debit`, `balance` may be exposed as a replaceable `u64` only if compiler analysis certifies replacement. The domain must not expose executor internals, fabricate references to dropped values, skip required effects, or resume after completion.
---

## Navigation
[← 09 Research & Experimental Frontier](../09-research/README.md) | [Table of Contents](../SUMMARY.md) | [AI & Semantic Tools →](../09-research/ai-and-semantic-tools.md)
