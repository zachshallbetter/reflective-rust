---
title: "Operational Semantic Graph"
scope: "mid-term"
status: "canonical"
version: "0.1.0"
updated: "2026-08-25"
summary: "Runtime topology model for capabilities, contracts, providers, data stores, models, and authority."
---
# Operational Semantic Graph

The Operational Semantic Graph (OSG) represents a running system's semantic topology. Its nodes describe runtimes, capabilities, authority boundaries, contracts, data stores, providers, and models; its edges describe relationships such as `offers`, `depends-on`, `reads-from`, `writes-to`, and `governed-by`.

The OSG is deliberately not the Compiler Semantic Graph. Source types and trait resolution belong to the CSG. Service manifests, model routing, databases, heartbeat state, schema drift, and provider dependencies belong to the OSG.

## Invariants

- Node identifiers are unique and stable within the graph authority.
- Every edge endpoint exists.
- Relationship names are explicit identifiers; absence is not inferred as a default relationship.
- Nodes and edges carry minimum access levels and are projected together.
- The enclosing RSP envelope supplies provenance and compatibility.
- Observed state is represented as an observation descriptor, not silently merged into declared configuration.

This separation permits applications to publish a declared runtime contract, derive topology from it, and attach live observations without confusing intent, implementation, and current state.
