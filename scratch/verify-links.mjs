import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');
const summaryPath = path.join(docsDir, 'SUMMARY.md');

const content = fs.readFileSync(summaryPath, 'utf8');
const linkRegex = /\[([^\]]+)\]\(([^)]+\.md)\)/g;

let match;
let total = 0;
let errors = 0;

while ((match = linkRegex.exec(content)) !== null) {
  total++;
  const label = match[1];
  const relPath = match[2];
  const absPath = path.join(docsDir, relPath);
  if (!fs.existsSync(absPath)) {
    console.error(`BROKEN LINK [${label}]: ${relPath} (full: ${absPath})`);
    errors++;
  }
}

console.log(`Link Verification Completed: ${total} links checked, ${errors} broken links.`);
if (errors > 0) {
  process.exit(1);
}
