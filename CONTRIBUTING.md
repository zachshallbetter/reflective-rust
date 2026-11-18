# Contributing

This repository is maintained by Zachary Shallbetter.

## Before opening a change

1. Read [`docs/meta/versioning.md`](docs/meta/versioning.md), [`docs/meta/conformance.md`](docs/meta/conformance.md), and [`docs/00-foundations/08-research-engineering-standards.md`](docs/00-foundations/08-research-engineering-standards.md).
2. Do not imply compiler reflection or cross-layer conformance that the records do not claim.
3. Run the verification gate in the README.

## Verification

CI ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs these on every pull request and on pushes to `main`.
Run them from the repository root before opening a pull request:

```sh
cargo fmt --all --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace --all-targets --locked
python3 scripts/check-structure.py
node scratch/verify-links.mjs
python3 scripts/check-changelogs.py
node scripts/gen-llms.mjs        # then commit llms.txt if it changed; CI fails on drift
```

CI also builds the explorer: `npm ci --prefix explorer && npm --prefix explorer run build`. The workspace needs Rust
1.88 or newer.

## Recording changes

- Workspace and crate behavior → [`CHANGELOG.md`](CHANGELOG.md) and the relevant layer changelog under `docs/` when applicable.
- CI may require changelog updates for touched layers.

## Commits and pull requests

Commit and pull request titles are short and descriptive, usually with a prefix such as `docs:` or `ci:`. Pull requests
are merged by the maintainer; the pull request template asks what you ran.

## Claims

Benchmarks must not be turned into performance claims without an explicit, scoped statement. Fixture CSG graphs must remain labeled as fixtures.

## Security

Report vulnerabilities privately, as [SECURITY.md](SECURITY.md) describes, not in a public issue.
