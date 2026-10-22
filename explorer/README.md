# Reflective Rust Explorer

This directory contains the interactive research explorer for the Reflective Rust proposal and runtime reference workspace. The compiler-reflection visualizations are **illustrative simulations**, not a working compiler integration. See the [root README](../README.md) and [implementation status](../docs/IMPLEMENTATION_STATUS.md) for what is implemented.

## Requirements

- Node.js compatible with the versions in the lockfile
- npm

## Run locally

From this directory:

```bash
npm ci
npm run dev
```

The dev and build scripts generate the consolidated documentation corpus from the repository sources and copy it into `public/llms-full.txt` for the corpus viewer.

## Validate and build

```bash
npm run lint
npm run build
npm run preview
```

Generated corpus files are build artifacts and are not committed from `explorer/public/`.
