import fs from 'fs';
import path from 'path';

// 1. Leer variables desde process.env (Netlify) o desde .env local si existe
const envVars = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || '',
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || '',
  VITE_OWNER_EMAIL: process.env.VITE_OWNER_EMAIL || 'dalekavideos@gmail.com',
};

if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key in envVars && !envVars[key] && !val.includes('TU_PROYECTO') && !val.includes('TU_SUPABASE')) {
      envVars[key] = val;
    }
  }
}

// 2. Crear estructura dist/
fs.mkdirSync('dist/src', { recursive: true });
fs.mkdirSync('dist/cards', { recursive: true });

// 3. Copiar src/ y cards/
function copyRecursive(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else if (!entry.name.endsWith('.zip')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

copyRecursive('src', 'dist/src');
copyRecursive('cards', 'dist/cards');

// 4. Inyectar window.__NARMER_ENV__ en dist/index.html para que Netlify y el navegador lean VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
let indexHtml = fs.readFileSync('index.html', 'utf8');
const envScript = `<script>window.__NARMER_ENV__ = ${JSON.stringify(envVars)};</script>\n  </head>`;
indexHtml = indexHtml.replace('</head>', envScript);
fs.writeFileSync('dist/index.html', indexHtml, 'utf8');

console.log('Build completado en dist/ con soporte de variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.');

