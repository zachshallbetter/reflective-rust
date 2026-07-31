---
title: "Semantic Graph Agent Context Slicing"
scope: "long-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Semantic Graph Agent Context Slicing under Scope III: Long-Term (Reflective Environments, AI Tooling & Spatial Projection)."
---
# Semantic Graph Agent Context Slicing

> **Status:** Canonical Long-Term Research Specification  
> **Target:** AI-Native Tooling & Agent Context Optimization  

This document specifies the **Semantic Context Slicing Engine** that replaces raw token window guessing in AI agentic coding assistants with compiler-confirmed semantic slices.

---

## 1. Limitations of Text-Based Context Windows

Traditional AI coding assistants rely on raw text retrieval (RAG or vector search), which frequently suffers from:
- **Truncated Type Definitions**: Passing incomplete code snippets where trait bounds or generic parameters are missing.
- **Hidden Lifetimes & Borrows**: Failing to provide ownership boundaries and drop flags.
- **Privacy Evasion**: Suggesting calls to private module items.

---

## 2. CSG Context Slicing Algorithm

Instead of feeding raw source text to an AI agent, the assistant requests a **Compiler Semantic Graph Slice** around a target entity $E$:

```rust
pub fn slice_around(
    csg: &CompilerSemanticGraph,
    entity: Info,
    max_depth: usize,
) -> SemanticSlice {
    let mut slice = SemanticSlice::new();
    slice.add_declaration(entity);
    slice.add_type_bounds(csg.resolved_bounds(entity));
    slice.add_call_graph_neighbors(csg.callers_and_callees(entity, max_depth));
    slice.add_borrow_invariants(csg.lifetime_bounds(entity));
    slice.enforce_privacy_barriers(csg.current_scope());
    slice
}
```

---

## 3. Benefits for Agent Reasoning

1. **Zero Hallucinated Signatures**: AI agents operate on compiler-resolved function signatures, associated types, and trait impls.
2. **Deterministic Context Boundaries**: Context size is governed by semantic dependency depth rather than arbitrary token character limits.
3. **Exact Error Localization**: Compiler diagnostics carry exact CSG node references, allowing AI agents to navigate directly to the root cause of type errors.
---

## Navigation
[← SSP Spatial Anchor Protocol](../09-research/ssp-spatial-anchor-protocol.md) | [Table of Contents](../SUMMARY.md) | [Performance Metrics & Empirical Proof →](../09-research/performance-and-empirical-proof.md)
