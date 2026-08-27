import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n======================================================');
console.log('🎬 CineWave Full-Stack Platform');
console.log('📡 Backend API : http://localhost:5000/api');
console.log('💻 Frontend App: http://localhost:5173');
console.log('🗄️ Database    : database/store.json');
console.log('======================================================\n');

const isWin = process.platform === 'win32';
const npmExecutable = isWin ? 'npm.cmd' : 'npm';

// 1. Start Backend API Server
const backend = spawn(
  npmExecutable,
  ['run', 'dev'],
  {
    cwd: path.join(__dirname, 'backend'),
    stdio: 'inherit',
    shell: isWin
  }
);

backend.on('error', (err) => {
  console.error('Backend process error:', err);
});

// 2. Start Frontend Client
const frontend = spawn(
  npmExecutable,
  ['run', 'dev'],
  {
    cwd: path.join(__dirname, 'frontend'),
    stdio: 'inherit',
    shell: isWin
  }
);

frontend.on('error', (err) => {
  console.error('Frontend process error:', err);
});

const shutdown = () => {
  console.log('\n🛑 Shutting down CineWave full-stack...');
  try {
    backend.kill();
    frontend.kill();
  } catch {}
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
