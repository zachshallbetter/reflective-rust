---
title: "Agent-First Publishing & Artifact Strategy"
status: "canonical"
version: "1.0.2"
updated: "2026-10-22"
---

# Reflective Rust Agent-First Publishing Strategy

> **Status:** Canonical Publishing Specification  
> **Adapted from:** Fundamental Engine `PUBLISHING.md`  

This document specifies how **Reflective Rust** artifacts are published for human researchers, static book generation (`mdbook`), and AI agent consumption (`llms-full.txt`).

---

## 1. Publishing Channels

| Channel | Target Audience | Primary Artifact | Build Tool |
| :--- | :--- | :--- | :--- |
| **Interactive mdBook** | Human Researchers & Web | Static HTML under `book/` | `mdbook build` |
| **Single-File Agent Corpus** | AI Agents & RAG Pipelines | Generated `llms-full.txt` (size varies with corpus) | `node scripts/gen-llms.mjs` |
| **Machine Manifest** | Automated Indexers | `llms.txt` | `node scripts/gen-llms.mjs` |
| **Academic Repositories** | Citations & Deposits | `CITATION.cff` & DOI Deposits | ORCID / Zenodo |
| **Rust Registry** | Runtime protocol consumers | versioned crates beginning with `reflective-rust-protocol` | Cargo |

---

## 2. Downstream Invariant

`llms.txt` and `llms-full.txt` are generated downstream artifacts. Their contents and sizes depend on the current source corpus; regenerate them rather than editing generated output directly. 

Per [the authority policy](authority.md), generated artifacts must not be manually edited to introduce or override canonical content. Make documentation changes in the source files, run `node scripts/gen-llms.mjs`, and review the generated diff. Only claim an artifact is published or tracked after confirming its repository and release state.
