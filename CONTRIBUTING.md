# Contributing

This repository is maintained by Zachary Shallbetter.

## Before opening a change

1. Read [`docs/meta/versioning.md`](docs/meta/versioning.md), [`docs/meta/conformance.md`](docs/meta/conformance.md), and [`docs/00-foundations/08-research-engineering-standards.md`](docs/00-foundations/08-research-engineering-standards.md).
2. Do not imply compiler reflection or cross-layer conformance that the records do not claim.
3. Run the verification gate in the README.

## Recording changes

- Workspace and crate behavior → [`CHANGELOG.md`](CHANGELOG.md) and the relevant layer changelog under `docs/` when applicable.
- CI may require changelog updates for touched layers.

## Claims

Benchmarks must not be turned into performance claims without an explicit, scoped statement. Fixture CSG graphs must remain labeled as fixtures.
