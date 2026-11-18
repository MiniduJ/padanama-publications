const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public_html');

// Create fresh public_html directory
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy .next/static to public_html/_next/static
const nextStaticSrc = path.join(__dirname, '..', '.next', 'static');
const nextStaticDest = path.join(outDir, '_next', 'static');
copyDir(nextStaticSrc, nextStaticDest);

// 2. Copy compiled html files from .next/server/app
const appDir = path.join(__dirname, '..', '.next', 'server', 'app');

function copyHtml(dir, targetSubDir = '') {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      copyHtml(fullPath, path.join(targetSubDir, entry.name));
    } else if (entry.name.endsWith('.html')) {
      const destFolder = path.join(outDir, targetSubDir);
      fs.mkdirSync(destFolder, { recursive: true });
      fs.copyFileSync(fullPath, path.join(destFolder, entry.name));
    }
  }
}

copyHtml(appDir);

// 3. Set up root index.html from si.html (primary Sinhala locale)
const siHtml = path.join(outDir, 'si.html');
if (fs.existsSync(siHtml)) {
  fs.copyFileSync(siHtml, path.join(outDir, 'index.html'));
}

console.log('Firebase Hosting public directory prepared successfully at:', outDir);
