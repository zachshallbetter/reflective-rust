import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const agentsDir = path.join(rootDir, '.agents');

function getGitVersion() {
  try {
    const gitTag = execSync('git describe --tags --abbrev=0', { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (gitTag) return gitTag.replace(/^v/, '');
  } catch (_) {}
  try {
    const gitHash = execSync('git rev-parse --short HEAD', { cwd: rootDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    if (gitHash) return `0.1.0+${gitHash}`;
  } catch (_) {}
  return '0.1.0';
}

const VERSION = getGitVersion();
const ABBR = 'rr';

const summaryPath = path.join(docsDir, 'SUMMARY.md');
const llmsTxtPath = path.join(rootDir, 'llms.txt');
const llmsFullTxtPath = path.join(rootDir, 'llms-full.txt');

if (!fs.existsSync(agentsDir)) {
  fs.mkdirSync(agentsDir, { recursive: true });
}

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
  '- .agents/AGENTS.md: Research doctrine & status honesty rules',
  '- CLAUDE.md: Agent operational guide & verification commands',
  '',
  '## Canonical Chapters (under docs/)',
  '',
  ...files.map(f => `- docs/${f.relPath}: ${f.label}`)
].join('\n');

// Write unversioned and abbreviated versioned llms.txt
fs.writeFileSync(llmsTxtPath, llmsTxtContent, 'utf8');
fs.writeFileSync(path.join(rootDir, `llms-${ABBR}-v${VERSION}.txt`), llmsTxtContent, 'utf8');
fs.writeFileSync(path.join(agentsDir, 'llms.txt'), llmsTxtContent, 'utf8');
fs.writeFileSync(path.join(agentsDir, `llms-${ABBR}-v${VERSION}.txt`), llmsTxtContent, 'utf8');

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

// Write unversioned and abbreviated versioned llms-full.txt
fs.writeFileSync(llmsFullTxtPath, llmsFullContent, 'utf8');
fs.writeFileSync(path.join(rootDir, `llms-full-${ABBR}-v${VERSION}.txt`), llmsFullContent, 'utf8');
fs.writeFileSync(path.join(agentsDir, 'llms.txt'), llmsFullContent, 'utf8');
fs.writeFileSync(path.join(agentsDir, `llms-full-${ABBR}-v${VERSION}.txt`), llmsFullContent, 'utf8');

console.log(`Generated llms.txt, llms-full.txt, llms-${ABBR}-v${VERSION}.txt, and llms-full-${ABBR}-v${VERSION}.txt (${(fs.statSync(llmsFullTxtPath).size / 1024).toFixed(1)} KB) [Git Version: v${VERSION}].`);
