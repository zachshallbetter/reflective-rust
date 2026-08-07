#!/usr/bin/env python3
"""
Reflective Rust Structure & Link Verification Script
Adapted from FCI & Normative Prose Specification verification craft.
Verifies directory layout, SUMMARY.md link integrity under docs/, and frontmatter presence.
"""

import os
import re
import sys

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS_DIR = os.path.join(PROJECT_ROOT, "docs")

REQUIRED_DIRS = [
    "docs",
    "docs/00-foundations",
    "docs/01-history",
    "docs/02-comparative-analysis",
    "docs/03-rust-language-proposal",
    "docs/04-runtime",
    "docs/05-metaobjects",
    "docs/06-procedural-reflection",
    "docs/07-compiler",
    "docs/08-reference",
    "docs/09-research",
    "docs/appendices",
    "docs/diagrams",
    ".agents",
    "scripts",
    "scratch",
]

REQUIRED_FILES = [
    "docs/README.md",
    "docs/SUMMARY.md",
    "AUTHORITY.md",
    "VERSIONING.md",
    "RELEASING.md",
    "PUBLISHING.md",
    "book.toml",
    ".agents/AGENTS.md",
    ".gitignore",
]


def check_directories():
    print("[1/3] Checking required directory layout...")
    missing = []
    for d in REQUIRED_DIRS:
        path = os.path.join(PROJECT_ROOT, d)
        if not os.path.isdir(path):
            missing.append(d)

    if missing:
        print(f"FAILED: Missing directories: {missing}")
        return False
    print("  [OK] All required directories exist.")
    return True


def check_required_files():
    print("[2/3] Checking required root files...")
    missing = []
    for f in REQUIRED_FILES:
        path = os.path.join(PROJECT_ROOT, f)
        if not os.path.isfile(path):
            missing.append(f)

    if missing:
        print(f"FAILED: Missing required files: {missing}")
        return False
    print("  [OK] All required root files exist.")
    return True


def check_summary_links():
    print("[3/3] Checking docs/SUMMARY.md link targets & frontmatter...")
    summary_path = os.path.join(DOCS_DIR, "SUMMARY.md")
    with open(summary_path, "r", encoding="utf-8") as f:
        content = f.read()

    link_regex = re.compile(r"\[([^\]]+)\]\(([^)]+\.md)\)")
    matches = link_regex.findall(content)

    total_links = 0
    broken_links = 0
    missing_frontmatter = 0

    for label, rel_path in matches:
        total_links += 1
        abs_path = os.path.join(DOCS_DIR, rel_path)
        if not os.path.isfile(abs_path):
            print(f"  BROKEN LINK: [{label}] -> {rel_path} (full: {abs_path})")
            broken_links += 1
            continue

        with open(abs_path, "r", encoding="utf-8") as target_f:
            target_content = target_f.read()
            if not target_content.startswith("---"):
                print(f"  MISSING FRONTMATTER: {rel_path}")
                missing_frontmatter += 1

    print(
        f"  [OK] Summary links verified: {total_links} links checked, {broken_links} broken, {missing_frontmatter} missing frontmatter."
    )

    if broken_links > 0 or missing_frontmatter > 0:
        return False
    return True


def main():
    print("==================================================")
    print("      Reflective Rust Verification Gate           ")
    print("==================================================")

    step1 = check_directories()
    step2 = check_required_files()
    step3 = check_summary_links()

    if step1 and step2 and step3:
        print("==================================================")
        print(" SUCCESS: All structural & link gates PASSED.     ")
        print("==================================================")
        sys.exit(0)
    else:
        print("==================================================")
        print(" FAILED: One or more structural gates failed.    ")
        print("==================================================")
        sys.exit(1)


if __name__ == "__main__":
    main()
