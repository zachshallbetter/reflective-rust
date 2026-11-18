## What and why

<!-- What does this change do, and what problem does it solve? -->

## How it was verified

<!-- Tick what you ran. CI runs these gates on every pull request. -->

- [ ] `cargo fmt --all --check`
- [ ] `cargo clippy --workspace --all-targets -- -D warnings`
- [ ] `cargo test --workspace --all-targets --locked`
- [ ] `python3 scripts/check-structure.py`
- [ ] `node scratch/verify-links.mjs`
- [ ] `python3 scripts/check-changelogs.py`, with `CHANGELOG.md` updated
- [ ] `node scripts/gen-llms.mjs` run and `llms.txt` committed, if documents changed

## Notes

<!-- Anything reviewers should know: trade-offs, follow-ups. -->
<!-- Do not imply compiler reflection or cross-layer conformance the records do not claim. -->
