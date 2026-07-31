import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const summaryPath = path.join(docsDir, 'SUMMARY.md');

const scopeMap = {
  '00-foundations': 'near-term',
  '03-rust-language-proposal': 'near-term',
  '08-reference': 'near-term',
  '04-runtime': 'mid-term',
  '05-metaobjects': 'mid-term',
  '07-compiler': 'mid-term',
  '06-procedural-reflection': 'long-term',
  '09-research': 'long-term',
  '01-history': 'context',
  '02-comparative-analysis': 'context',
  'appendices': 'context',
  'diagrams': 'context'
};

const scopeTitleMap = {
  'near-term': 'Scope I: Near-Term (Rust Semantic Reflection & Compile-Time Metaprogramming)',
  'mid-term': 'Scope II: Mid-Term (Compiler Semantic Graph & Runtime Semantic Projection)',
  'long-term': 'Scope III: Long-Term (Reflective Environments, AI Tooling & Spatial Projection)',
  'context': 'Historical Evidence & Comparative Context'
};

const summaryContent = fs.readFileSync(summaryPath, 'utf8');
const linkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g;

let match;
const orderedFiles = [];
while ((match = linkRegex.exec(summaryContent)) !== null) {
  const label = match[1];
  const relPath = match[2];
  if (relPath !== 'README.md') {
    orderedFiles.push({ label, relPath });
  }
}

for (let i = 0; i < orderedFiles.length; i++) {
  const item = orderedFiles[i];
  const absPath = path.join(docsDir, item.relPath);
  if (!fs.existsSync(absPath)) {
    continue;
  }

  let content = fs.readFileSync(absPath, 'utf8');

  if (content.startsWith('---')) {
    const endIdx = content.indexOf('---', 3);
    if (endIdx !== -1) {
      content = content.slice(endIdx + 3).trim();
    }
  }

  content = content.replace(/Rust Reflective Systems Architecture/g, 'Reflective Rust (RRSA)');

  const navMarkIdx = content.indexOf('## Navigation');
  if (navMarkIdx !== -1) {
    content = content.slice(0, navMarkIdx).trim();
  }

  while (content.endsWith('---')) {
    content = content.slice(0, content.length - 3).trim();
  }

  let title = item.label;
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    title = h1Match[1].trim();
  }

  const folder = item.relPath.split('/')[0];
  const scope = scopeMap[folder] || 'research';
  const scopeTitle = scopeTitleMap[scope] || 'Reflective Rust Research';

  const newFm = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `scope: "${scope}"`,
    `status: "canonical"`,
    `version: "1.0.0"`,
    `updated: "2026-07-31"`,
    `summary: "Reflective Rust research specification for ${title} under ${scopeTitle}."`,
    '---',
    ''
  ].join('\n');

  const prevItem = i > 0 ? orderedFiles[i - 1] : null;
  const nextItem = i < orderedFiles.length - 1 ? orderedFiles[i + 1] : null;

  const currentDepth = item.relPath.split('/').length - 1;
  const backPrefix = '../'.repeat(currentDepth);

  const prevLink = prevItem ? `[← ${prevItem.label}](${backPrefix}${prevItem.relPath})` : '← Beginning';
  const summaryLink = `[Table of Contents](${backPrefix}SUMMARY.md)`;
  const nextLink = nextItem ? `[${nextItem.label} →](${backPrefix}${nextItem.relPath})` : 'End →';

  const navFooter = [
    '',
    '---',
    '',
    '## Navigation',
    `${prevLink} | ${summaryLink} | ${nextLink}`
  ].join('\n');

  const finalContent = newFm + content + navFooter + '\n';
  fs.writeFileSync(absPath, finalContent, 'utf8');
}

console.log('Cleaned and standardized all documentation files in docs/.');
