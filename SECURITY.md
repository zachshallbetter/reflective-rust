# Security Policy

## Reporting a vulnerability

Report it privately through GitHub: [report a vulnerability](https://github.com/zachshallbetter/reflective-rust/security/advisories/new).
Please don't open a public issue, pull request or discussion for it. Include the affected crate and version, what an
attacker can do, and a minimal reproduction.

This project has a solo maintainer. Reports are handled on a best-effort basis, with no response-time guarantee (no SLA).

## Scope

Reflective Rust is research software with a reference implementation, not a production service (see
[Implementation status](docs/IMPLEMENTATION_STATUS.md)). Reports about the executable workspace in `crates/` are in
scope, for example:

- validation, access projection or canonical JSON and SHA-256 identity in `reflective-rust-protocol` that can be
  bypassed, or that lets a crafted envelope pass or collide;
- Ed25519 authentication, trusted key-ID binding or freshness-window checks that accept an envelope they should reject;
- unsafe code or memory-safety problems in the derive macro or the other crates;
- `reflective-rust-server`, the minimal read-only protocol discovery endpoint (it binds `127.0.0.1:8080`), or
  `reflective-rust-cli` misbehaving on crafted input;
- secrets or personal data committed to the repository.

Out of scope: compiler-reflection facilities, which are a language and compiler proposal and are not implemented, and
benchmark results, which carry no performance claims.

## Supported versions

Fixes go into the `main` branch and the latest tagged release. Update to either before reporting.
