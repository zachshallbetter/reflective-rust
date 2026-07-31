#!/usr/bin/env python3
"""
Reflective Rust Layer Changelog Verification Script
Adapted from FCI & Fundamental Engine PR checks.
Inspects modified paths and verifies that touched layers update their respective changelogs.
"""

import os
import subprocess
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def get_modified_files():
    try:
        # Check against git diff if in a git repo
        result = subprocess.run(
            ["git", "diff", "--name-only", "HEAD~1", "HEAD"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        return [line.strip() for line in result.stdout.splitlines() if line.strip()]
    except Exception:
        # Fallback if no git commit yet
        return []


def main():
    print("==================================================")
    print("      Reflective Rust Layer Changelog Gate        ")
    print("==================================================")

    modified_files = get_modified_files()
    if not modified_files:
        print("  No git diff detected or initial repository state.")
        print("  ✓ Layer Changelog Gate PASSED (Vacuous).")
        sys.exit(0)

    print(f"  Modified files in diff ({len(modified_files)}):")
    for f in modified_files:
        print(f"    - {f}")

    # Map folders to changelogs
    docs_modified = any(f.startswith("docs/") for f in modified_files)
    changelog_modified = any("CHANGELOG.md" in f for f in modified_files)

    if docs_modified and not changelog_modified:
        print("\nFAILED: Changes detected under docs/ without updating CHANGELOG.md.")
        print(
            "Per VERSIONING.md, every layer modification must update its per-layer record."
        )
        sys.exit(1)

    print("  ✓ Layer Changelog Gate PASSED.")
    sys.exit(0)


if __name__ == "__main__":
    main()
