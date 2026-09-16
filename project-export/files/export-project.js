#!/usr/bin/env node
/**
 * export-project.js  (เวอร์ชัน 2)
 * สร้างโฟลเดอร์ project-export/ + ไฟล์ ZIP
 *
 * วิธีใช้:  node export-project.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ====== ตั้งค่า ======
const ROOT = process.cwd();
const EXPORT_DIR = path.join(ROOT, 'project-export');
const FILES_DIR = path.join(EXPORT_DIR, 'files');
const SUMMARY_FILE = path.join(EXPORT_DIR, 'PROJECT-SUMMARY.md');
const ZIP_FILE = path.join(ROOT, 'project-export.zip');

const IGNORE_DIRS = new Set([
  'node_modules', '.git', '.next', '.nuxt', '.svelte-kit',
  'dist', 'build', 'out', '.output', 'coverage',
  '.cache', '.turbo', '.parcel-cache', '.vercel', '.netlify',
  '.idea', '.vscode', '.fleet', '.history',
  'venv', 'env', '__pycache__', '.pytest_cache', '.mypy_cache',
  'target', 'vendor', 'tmp', 'temp', 'logs',
  'project-export',
]);

const IGNORE_FILES = new Set([
  'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb',
  '.DS_Store', 'Thumbs.db', 'desktop.ini',
  'PROJECT-SUMMARY.md', 'project-export.zip',
  '.env', '.env.local', '.env.development', '.env.production',
  '.env.staging', '.env.test',
]);

const IGNORE_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.bmp', '.tiff',
  '.mp4', '.mp3', '.wav', '.mov', '.avi', '.webm', '.m4a', '.flac',
  '.zip', '.tar', '.gz', '.rar', '.7z', '.bz2',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.woff', '.woff2', '.ttf', '.eot', '.otf', '.map',
  '.log', '.tmp', '.cache', '.pid',
]);

const TEXT_EXT = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs',
  '.html', '.htm', '.css', '.scss', '.sass', '.less', '.styl',
  '.json', '.jsonc', '.yaml', '.yml', '.toml', '.ini', '.cfg', '.conf',
  '.md', '.mdx', '.txt', '.rst',
  '.sql', '.prisma', '.graphql', '.gql',
  '.vue', '.svelte', '.astro',
  '.php', '.py', '.rb', '.go', '.rs', '.java', '.kt', '.swift', '.cs',
  '.sh', '.bash', '.zsh', '.fish', '.bat', '.ps1', '.cmd',
  '.xml', '.xsl', '.xsd', '.example',
]);

const LANG_MAP = {
  js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
  mjs: 'javascript', cjs: 'javascript',
  html: 'html', htm: 'html', css: 'css', scss: 'scss',
  sass: 'sass', less: 'less', styl: 'stylus',
  json: 'json', jsonc: 'jsonc', yaml: 'yaml', yml: 'yaml',
  toml: 'toml', ini: 'ini', cfg: 'ini', conf: 'nginx',
  md: 'markdown', mdx: 'mdx', txt: 'text',
  py: 'python', rb: 'ruby', go: 'go', rs: 'rust',
  sh: 'bash', bash: 'bash', zsh: 'bash', fish: 'fish',
  bat: 'bat', ps1: 'powershell', cmd: 'batch',
  sql: 'sql', graphql: 'graphql', gql: 'graphql', prisma: 'prisma',
  vue: 'vue', svelte: 'svelte', astro: 'astro',
  php: 'php', java: 'java', kt: 'kotlin', swift: 'swift', cs: 'csharp',
  xml: 'xml',
};

// ====== Colors ======
const C = {
  reset: '\x1b[0m', bright: '\x1b[1m',
  green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', cyan: '\x1b[36m', red: '\x1b[31m',
};
const log = {
  info: (m) => console.log(`${C.cyan}ℹ${C.reset} ${m}`),
  ok:   (m) => console.log(`${C.green}✓${C.reset} ${m}`),
  warn: (m) => console.log(`${C.yellow}⚠${C.reset} ${m}`),
  err:  (m) => console.log(`${C.red}✗${C.reset} ${m}`),
  title:(m) => console.log(`\n${C.bright}${C.blue}${m}${C.reset}\n`),
};

// ====== Helpers ======
function shouldIgnore(name, isDir) {
  if (isDir) return IGNORE_DIRS.has(name);
  if (IGNORE_FILES.has(name)) return true;
  const ext = path.extname(name).toLowerCase();
  return IGNORE_EXT.has(ext);
}

function isTextFile(name) {
  if (name.startsWith('.') && !name.slice(1).includes('.')) return true;
  const ext = path.extname(name).toLowerCase();
  return TEXT_EXT.has(ext);
}

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1024 / 1024).toFixed(2) + ' MB';
}

function readDirSorted(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => !shouldIgnore(e.name, e.isDirectory()))
    .sort((a, b) => {
      if (a.isDirectory() && !b.isDirectory()) return -1;
      if (!a.isDirectory() && b.isDirectory()) return 1;
      return a.name.localeCompare(b.name);
    });
}

function buildTree(dir, prefix = '') {
  const entries = readDirSorted(dir);
  const lines = [];
  entries.forEach((entry, i) => {
    const isLast = i === entries.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      lines.push(prefix + connector + entry.name + '/');
      const sub = buildTree(full, childPrefix);
      if (sub) lines.push(sub);
    } else {
      const size = fs.statSync(full).size;
      lines.push(prefix + connector + entry.name + ` (${formatBytes(size)})`);
    }
  });
  return lines.filter(Boolean).join('\n');
}

function collectFiles(dir, relBase = '') {
  const out = [];
  for (const entry of readDirSorted(dir)) {
    const full = path.join(dir, entry.name);
    const rel = relBase ? path.join(relBase, entry.name) : entry.name;
    if (entry.isDirectory()) out.push(...collectFiles(full, rel));
    else out.push({ full, rel });
  }
  return out;
}

function copyRecursiveSafe(srcDir, destDir, relBase = '') {
  for (const entry of readDirSorted(srcDir)) {
    const srcFull = path.join(srcDir, entry.name);
    const rel = relBase ? path.join(relBase, entry.name) : entry.name;
    const destFull = path.join(destDir, rel);

    if (entry.isDirectory()) {
      fs.mkdirSync(destFull, { recursive: true });
      copyRecursiveSafe(srcFull, destDir, rel);
    } else {
      if (!isTextFile(entry.name)) continue;
      fs.mkdirSync(path.dirname(destFull), { recursive: true });
      fs.copyFileSync(srcFull, destFull);
    }
  }
}

// ====== Main ======
function main() {
  log.title('📦 Project Export — สร้างโฟลเดอร์ + ZIP');
  log.info(`Root: ${ROOT}`);

  // 1) ลบโฟลเดอร์เก่า (ถ้ามี)
  if (fs.existsSync(EXPORT_DIR)) {
    log.warn('พบโฟลเดอร์ project-export/ เดิม → ลบทิ้ง');
    fs.rmSync(EXPORT_DIR, { recursive: true, force: true });
  }
  if (fs.existsSync(ZIP_FILE)) {
    log.warn('พบไฟล์ project-export.zip เดิม → ลบทิ้ง');
    fs.rmSync(ZIP_FILE, { force: true });
  }

  // 2) สร้างโฟลเดอร์ใหม่
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
  fs.mkdirSync(FILES_DIR, { recursive: true });
  log.ok('สร้างโฟลเดอร์ project-export/ สำเร็จ');

  // 3) อ่าน package.json
  let pkg = null;
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  } catch {}

  // 4) สร้าง PROJECT-SUMMARY.md
  const parts = [];
  parts.push('# 📋 Project Summary');
  parts.push(`> สร้างเมื่อ: \`${new Date().toISOString()}\``);
  if (pkg) parts.push(`> โปรเจกต์: **${pkg.name || 'untitled'}** ${pkg.version ? `v${pkg.version}` : ''}`);
  parts.push('');
  parts.push('ไฟล์นี้สรุปโครงสร้างและเนื้อหาสำคัญของโปรเจกต์');
  parts.push('');
  parts.push('---');
  parts.push('');

  // 1. Info
  parts.push('## 1. ข้อมูลโปรเจกต์');
  parts.push('');
  if (pkg) {
    parts.push('```json');
    parts.push(JSON.stringify({
      name: pkg.name,
      version: pkg.version,
      description: pkg.description,
      main: pkg.main,
      type: pkg.type,
      scripts: pkg.scripts,
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      engines: pkg.engines,
    }, null, 2));
    parts.push('```');
  } else {
    parts.push('_ไม่พบ package.json_');
  }
  parts.push('');

  // 2. Structure
  parts.push('## 2. โครงสร้างโปรเจกต์');
  parts.push('');
  parts.push('```');
  parts.push(path.basename(ROOT) + '/');
  parts.push(buildTree(ROOT));
  parts.push('```');
  parts.push('');

  // 3. Files content
  parts.push('## 3. เนื้อหาไฟล์สำคัญ');
  parts.push('');
  parts.push('> เฉพาะไฟล์ text ที่จำเป็น ไม่รวม binary / lock files / .env จริง');
  parts.push('');

  const files = collectFiles(ROOT);
  let included = 0, skipped = 0, totalSize = 0;

  for (const { full, rel } of files) {
    const stat = fs.statSync(full);
    const name = path.basename(rel);
    if (!isTextFile(name)) { skipped++; continue; }
    if (stat.size > 200 * 1024) {
      parts.push(`### 📄 \`${rel}\``);
      parts.push(`> ⚠️ ไฟล์ใหญ่เกินไป (${formatBytes(stat.size)}) — ข้ามเนื้อหา`);
      parts.push('');
      skipped++;
      continue;
    }
    let content = '';
    try { content = fs.readFileSync(full, 'utf8'); }
    catch { skipped++; continue; }
    const ext = path.extname(rel).toLowerCase().slice(1);
    const lang = LANG_MAP[ext] || 'text';
    const safe = content.replace(/```/g, '`\u200b``');
    parts.push(`### 📄 \`${rel}\``);
    parts.push('');
    parts.push('```' + lang);
    parts.push(safe);
    parts.push('```');
    parts.push('');
    included++;
    totalSize += stat.size;
  }

  // 4. Instructions
  parts.push('---');
  parts.push('');
  parts.push('## 4. คำแนะนำสำหรับ AI ที่จะสานต่องาน');
  parts.push('');
  parts.push('### ✅ สิ่งที่ต้องทำ');
  parts.push('- อ่านโครงสร้าง (ข้อ 2) และเนื้อหาไฟล์ (ข้อ 3) ให้ครบก่อนแก้ไข');
  parts.push('- รักษาโครงสร้างโฟลเดอร์และชื่อไฟล์เดิมไว้');
  parts.push('- ใช้ tech stack และ dependencies ที่มีอยู่แล้ว (ดู package.json)');
  parts.push('- เขียนโค้ดให้สอดคล้องกับ style เดิม');
  parts.push('- อ้างอิง path จากโครงสร้างจริงเท่านั้น');
  parts.push('');
  parts.push('### 🚫 สิ่งที่ห้ามทำ');
  parts.push('- ห้ามลบหรือย้ายไฟล์โดยไม่แจ้ง');
  parts.push('- ห้ามเพิ่ม dependencies ใหม่โดยไม่จำเป็น');
  parts.push('- ห้ามเปลี่ยน pattern ที่ใช้อยู่');
  parts.push('- ห้ามเดา path หรือชื่อไฟล์ที่ไม่มีในโปรเจกต์');
  parts.push('- ห้ามคัดลอกโค้ดทั้งไฟล์ ให้แก้เฉพาะส่วนที่จำเป็น');
  parts.push('');
  parts.push('### 📝 หมายเหตุ');
  parts.push('- โฟลเดอร์ `files/` มีสำเนาไฟล์ source แยกตามโฟลเดอร์');
  parts.push('- ไฟล์ที่ข้าม: node_modules, lock files, รูปภาพ, วิดีโอ, ไฟล์ build, .env จริง');
  parts.push('');

  // 5. Stats
  parts.push('---');
  parts.push('');
  parts.push('## 📊 สถิติ');
  parts.push('');
  parts.push('| รายการ | ค่า |');
  parts.push('|---|---|');
  parts.push(`| ไฟล์ที่รวมเนื้อหา | **${included}** |`);
  parts.push(`| ไฟล์ที่ข้าม | **${skipped}** |`);
  parts.push(`| ขนาด text รวม | **${formatBytes(totalSize)}** |`);
  parts.push('');

  fs.writeFileSync(SUMMARY_FILE, parts.join('\n'), 'utf8');
  log.ok('สร้าง PROJECT-SUMMARY.md สำเร็จ');

  // 5) คัดลอกไฟล์ source ไปไว้ files/
  copyRecursiveSafe(ROOT, FILES_DIR);
  log.ok('คัดลอกไฟล์ source ไปไว้ files/ สำเร็จ');

  // 6) ZIP
  log.info('กำลังบีบอัดเป็น ZIP...');
  let zipOk = false;
  try {
    if (process.platform === 'win32') {
      // Windows: ใช้ PowerShell Compress-Archive
      const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${EXPORT_DIR}' -DestinationPath '${ZIP_FILE}' -Force"`;
      execSync(psCmd, { stdio: 'inherit' });
    } else {
      // Mac / Linux
      execSync(`cd "${ROOT}" && zip -r "${ZIP_FILE}" project-export`, { stdio: 'inherit' });
    }
    zipOk = true;
  } catch (e) {
    log.warn('บีบอัด ZIP อัตโนมัติไม่สำเร็จ — แต่โฟลเดอร์ project-export/ ยังอยู่ครบ');
  }

  // สรุป
  console.log('');
  log.ok('เสร็จแล้ว!');
  log.info(`📁 โฟลเดอร์: ${EXPORT_DIR}`);
  if (zipOk) {
    const zipSize = fs.statSync(ZIP_FILE).size;
    log.info(`📦 ไฟล์ ZIP: ${ZIP_FILE} (${formatBytes(zipSize)})`);
  }
  console.log('');
  log.warn('👉 เอาโฟลเดอร์ project-export/ หรือไฟล์ project-export.zip ไปส่งให้แชทอื่นได้เลย');
}

main();