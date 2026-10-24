import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '..');
const source = path.join(rootDir, 'llms-full.txt');
const publicDir = path.join(rootDir, 'explorer', 'public');
const destination = path.join(publicDir, 'llms-full.txt');

if (!fs.existsSync(source)) {
  throw new Error('Missing generated llms-full.txt. Run node scripts/gen-llms.mjs first.');
}

fs.mkdirSync(publicDir, { recursive: true });
fs.copyFileSync(source, destination);
console.log('Copied generated corpus to explorer/public/llms-full.txt.');
