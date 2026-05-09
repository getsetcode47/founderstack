import { existsSync, rmSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';

const cwd = process.cwd();
const nextDir = path.join(cwd, '.next-dev');
const tsBuildInfo = path.join(cwd, 'tsconfig.tsbuildinfo');

for (const target of [nextDir, tsBuildInfo]) {
  if (existsSync(target)) {
    rmSync(target, { recursive: true, force: true });
  }
}

const child = spawn('next', ['dev'], {
  cwd,
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
