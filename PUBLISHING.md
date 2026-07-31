---
title: "Agent-First Publishing & Artifact Strategy"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
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
| **Single-File Agent Corpus** | AI Agents & RAG Pipelines | `llms-full.txt` (249+ KB) | `node scripts/gen-llms.mjs` |
| **Machine Manifest** | Automated Indexers | `llms.txt` | `node scripts/gen-llms.mjs` |
| **Academic Repositories** | Citations & Deposits | `CITATION.cff` & DOI Deposits | ORCID / Zenodo |

---

## 2. Downstream Invariant

`llms.txt` and `llms-full.txt` are **100% programmatically generated downstream artifacts**. 

Per [`AUTHORITY.md`](AUTHORITY.md), generated artifacts must **never** be manually edited. Any changes to documentation content must be made in the canonical source files under `docs/`.
