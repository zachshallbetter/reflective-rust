---
title: "Runnable Examples & Industrial Use Cases"
scope: "near-term"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
summary: "Reflective Rust research specification for Runnable Examples & Industrial Use Cases under Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)."
---
# Runnable Examples & Industrial Use Cases

> **Status:** Canonical Reference Manual  

This document details all 8 runnable reference examples provided across the **Reflective Rust** workspace crates.

---

## Workspace Examples Index

### 1. Static Semantic Reflection (`core::meta`)
- **Crate**: [`reflective-rust-meta`](../../crates/reflective-rust-meta)
- **File**: `crates/reflective-rust-meta/examples/static_reflection.rs`
- **Command**:
  ```bash
  cargo run --example static_reflection -p reflective-rust-meta
  ```
- **Description**: Demonstrates compile-time `Info` handle inspection, memory layout queries (`layout_of`), struct field iteration, and variant queries in `#![no_std]`.

### 2. Zero-Copy Binary Serializer (Real-World Industrial Case)
- **Crate**: [`reflective-rust-meta`](../../crates/reflective-rust-meta)
- **File**: `crates/reflective-rust-meta/examples/serde_zero_copy_serialization.rs`
- **Command**:
  ```bash
  cargo run --example serde_zero_copy_serialization -p reflective-rust-meta
  ```
- **Description**: Demonstrates zero-copy binary serialization and deserialization using compile-time layout attributes without macro code generation.

### 3. Opt-In Zero-Cost Runtime Descriptors (`#[derive(Reflectable)]`)
- **Crate**: [`reflective-rust-derive`](../../crates/reflective-rust-derive)
- **File**: `crates/reflective-rust-derive/examples/runtime_descriptors.rs`
- **Command**:
  ```bash
  cargo run --example runtime_descriptors -p reflective-rust-derive
  ```
- **Description**: Demonstrates applying `#[derive(Reflectable)]` to generate static `TypeDescriptor` VTables with zero memory cost for un-annotated types.

### 4. Dynamic ECS Component Registry (Real-World Industrial Case)
- **Crate**: [`reflective-rust-derive`](../../crates/reflective-rust-derive)
- **File**: `crates/reflective-rust-derive/examples/ecs_component_engine.rs`
- **Command**:
  ```bash
  cargo run --example ecs_component_engine -p reflective-rust-derive
  ```
- **Description**: Demonstrates automatic entity component registration for Entity-Component-System (ECS) game engines.

### 5. Compiler Semantic Graph (CSG) & JSON Schema
- **Crate**: [`reflective-rust-csg`](../../crates/reflective-rust-csg)
- **File**: `crates/reflective-rust-csg/examples/csg_query.rs`
- **Command**:
  ```bash
  cargo run --example csg_query -p reflective-rust-csg
  ```
- **Description**: Demonstrates graph node/edge creation and out-of-process JSON serialization.

### 6. Out-of-Process Dynamic RPC Dispatcher (Real-World Industrial Case)
- **Crate**: [`reflective-rust-csg`](../../crates/reflective-rust-csg)
- **File**: `crates/reflective-rust-csg/examples/rpc_dynamic_dispatcher.rs`
- **Command**:
  ```bash
  cargo run --example rpc_dynamic_dispatcher -p reflective-rust-csg
  ```
- **Description**: Demonstrates out-of-process JSON-RPC method dispatching based on CSG graph function node schemas.

### 7. Graph RAG Agent Context Slicing (`csg::slice_around`)
- **Crate**: [`reflective-rust-agent`](../../crates/reflective-rust-agent)
- **File**: `crates/reflective-rust-agent/examples/agent_slicing.rs`
- **Command**:
  ```bash
  cargo run --example agent_slicing -p reflective-rust-agent
  ```
- **Description**: Demonstrates extracting compiler-certified LLM prompt context blocks around a target symbol.

### 8. AI Agent Copilot Prompt Generator (Real-World Industrial Case)
- **Crate**: [`reflective-rust-agent`](../../crates/reflective-rust-agent)
- **File**: `crates/reflective-rust-agent/examples/ai_agent_copilot.rs`
- **Command**:
  ```bash
  cargo run --example ai_agent_copilot -p reflective-rust-agent
  ```
- **Description**: Demonstrates an AI assistant prompt context generator feeding clean privacy and type bounds directly to LLM agents.
---

## Navigation
[← Proposed API](../08-reference/proposed-api.md) | [Table of Contents](../SUMMARY.md) | [Cookbook →](../08-reference/cookbook.md)
