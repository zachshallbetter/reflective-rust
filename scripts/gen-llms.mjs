import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');

function getWorkspaceVersion() {
  const cargo = fs.readFileSync(path.join(rootDir, 'Cargo.toml'), 'utf8');
  const workspacePackage = cargo.match(/\[workspace\.package\]([\s\S]*?)(?:\n\[|$)/);
  const version = workspacePackage?.[1].match(/^version\s*=\s*"([^"]+)"/m);
  if (!version) throw new Error('workspace package version is missing from Cargo.toml');
  return version[1];
}

const VERSION = getWorkspaceVersion();
const summaryPath = path.join(docsDir, 'SUMMARY.md');
const llmsTxtPath = path.join(rootDir, 'llms.txt');
const llmsFullTxtPath = path.join(rootDir, 'llms-full.txt');


const summaryContent = fs.readFileSync(summaryPath, 'utf8');
const linkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g;

let match;
const files = [];
while ((match = linkRegex.exec(summaryContent)) !== null) {
  const label = match[1];
  const relPath = match[2];
  files.push({ label, relPath });
}

// Build llms.txt (index file)
const llmsTxtContent = [
  '# Reflective Rust: Agent Document Index',
  '',
  '> Reflective Rust: A Reflective Systems Architecture (RRSA) based on a Compiler Semantic Graph (CSG).',
  '',
  `Version: v${VERSION}`,
  '',
  '## Structural Hierarchy',
  '',
  '- docs/README.md: Overview, taxonomy matrix, and concentric scopes',
  '- AUTHORITY.md: Single source of truth & conflict resolution order',
  '- VERSIONING.md: Independent layer versioning policy',
  '- CONFORMANCE.md: Runtime protocol compatibility and consumer evidence',
  '- docs/00-foundations/08-research-engineering-standards.md: Research engineering standards & status honesty rules',
  '- CONTRIBUTING.md: Contribution and claim discipline',
  '',
  '## Canonical Chapters (under docs/)',
  '',
  ...files.map(f => `- docs/${f.relPath}: ${f.label}`)
].join('\n');

// Write the tracked index.
fs.writeFileSync(llmsTxtPath, llmsTxtContent, 'utf8');

// Build llms-full.txt (consolidated single-file corpus)
const fullContentBlocks = [
  '========================================================================',
  'REFLECTIVE RUST: CONSOLIDATED RESEARCH CORPUS',
  'Formal Architecture: Rust Reflective Systems Architecture (RRSA)',
  'Core Substrate: Compiler Semantic Graph (CSG)',
  `Version: v${VERSION}`,
  '========================================================================',
  '',
  fs.readFileSync(path.join(docsDir, 'README.md'), 'utf8'),
  '',
  '========================================================================',
  'AUTHORITY DETERMINATION & CONFLICT RESOLUTION',
  '========================================================================',
  '',
  fs.readFileSync(path.join(rootDir, 'AUTHORITY.md'), 'utf8'),
  '',
  '========================================================================',
  'INDEPENDENT LAYER VERSIONING POLICY',
  '========================================================================',
  '',
  fs.readFileSync(path.join(rootDir, 'VERSIONING.md'), 'utf8'),
  '',
  '========================================================================',
  'RUNTIME PROTOCOL CONFORMANCE RECORD',
  '========================================================================',
  '',
  fs.readFileSync(path.join(rootDir, 'CONFORMANCE.md'), 'utf8'),
  ''
];

for (const file of files) {
  const absPath = path.join(docsDir, file.relPath);
  if (fs.existsSync(absPath)) {
    fullContentBlocks.push(
      '========================================================================',
      `CHAPTER: ${file.label} (docs/${file.relPath})`,
      '========================================================================',
      '',
      fs.readFileSync(absPath, 'utf8'),
      ''
    );
  }
}

const llmsFullContent = fullContentBlocks.join('\n');

// Full corpora are local generated artifacts and are intentionally ignored.
fs.writeFileSync(llmsFullTxtPath, llmsFullContent, 'utf8');

console.log(`Generated llms.txt and local llms-full.txt (${(fs.statSync(llmsFullTxtPath).size / 1024).toFixed(1)} KB) [Workspace Version: v${VERSION}].`);
