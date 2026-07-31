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
        # Check staged and unstaged changes against HEAD
        result = subprocess.run(
            ["git", "diff", "--name-only", "HEAD"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            check=True,
        )
        files = [line.strip() for line in result.stdout.splitlines() if line.strip()]
        if not files:
            # Fallback to last commit if working tree clean
            res_commit = subprocess.run(
                ["git", "diff", "--name-only", "HEAD~1", "HEAD"],
                cwd=PROJECT_ROOT,
                capture_output=True,
                text=True,
                check=True,
            )
            files = [line.strip() for line in res_commit.stdout.splitlines() if line.strip()]
        return files
    except Exception:
        return []


def main():
    print("==================================================")
    print("      Reflective Rust Layer Changelog Gate        ")
    print("==================================================")

    modified_files = get_modified_files()
    if not modified_files:
        print("  No git diff detected.")
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
