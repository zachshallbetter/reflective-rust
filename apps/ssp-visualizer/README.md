---
title: "SSP Spatial Visualizer Web App"
status: "canonical"
version: "1.0.0"
updated: "2026-07-31"
---

# Semantic Spatial Projection (SSP) 3D Visualizer

WebGL 3D interactive spatial visualizer projecting the **Reflective Rust Compiler Semantic Graph (CSG)** into 3D space.

## Features

- **3D Spatial SE(3) Rendering**: Visualizes CSG nodes floating in spatial clusters across Scope I, Scope II, and Scope III.
- **Relational Binding Graph**: Renders structural edge dependencies connecting static reflection handles, compiler semantic graphs, and runtime descriptor registries.
- **Glassmorphic HUD Inspector**: Interactive raycasting node selection displaying handle IDs, subsystem scopes, privacy rules, and zero-cost consteval memory invariants.

## Running Locally

Serve the static app using any local HTTP server:

```bash
# Using Python
python3 -m http.server 8080 --directory apps/ssp-visualizer

# Or using npx serve
npx serve apps/ssp-visualizer
```

Open `http://localhost:8080` in any WebGL-capable browser.
