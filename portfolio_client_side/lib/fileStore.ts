import { promises as fs } from 'fs';
import { dirname, join } from 'path';

const DATA_DIR = process.env.DATA_DIR || 'data';
const VERSIONS_DIR = join(DATA_DIR, '.versions');

async function ensureDir(path: string) {
  await fs.mkdir(path, { recursive: true });
}

// lib/fileStore.ts - add this function
export async function initializeFiles() {
  await ensureDir(DATA_DIR);
  await ensureDir(VERSIONS_DIR);
  
  // Initialize blogs.json if needed
  try {
    await readJsonFile('blogs.json', []);
  } catch (err) {
    console.error('Failed to initialize blogs.json:', err);
  }
}

export async function readJsonFile<T>(relativePath: string, fallback: T): Promise<T> {
  const fullPath = join(DATA_DIR, relativePath);
  try {
    const raw = await fs.readFile(fullPath, 'utf8');
    
    // Handle empty files
    if (!raw || raw.trim() === '') {
      await writeJsonFile(relativePath, fallback);
      return fallback;
    }
    
    return JSON.parse(raw) as T;
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await ensureDir(dirname(fullPath));
      await writeJsonFile(relativePath, fallback);
      return fallback;
    }
    
    // Handle JSON parse errors by recreating the file
    if (err instanceof SyntaxError) {
      console.error(`Invalid JSON in ${relativePath}, resetting to fallback`);
      await writeJsonFile(relativePath, fallback);
      return fallback;
    }
    
    throw err;
  }
}

export async function writeJsonFile<T>(relativePath: string, data: T): Promise<void> {
  const fullPath = join(DATA_DIR, relativePath);
  const dir = dirname(fullPath);
  await ensureDir(dir);
  await ensureDir(VERSIONS_DIR);

  const json = JSON.stringify(data, null, 2);

  // Backup existing file
  try {
    const existing = await fs.readFile(fullPath, 'utf8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const versionPath = join(VERSIONS_DIR, `${relativePath.replace(/[\\/]/g, '_')}.${timestamp}.json`);
    await fs.writeFile(versionPath, existing, 'utf8');
  } catch (err: any) {
    // ignore if no existing file
  }

  // Atomic write via temp file then rename
  const tmpPath = `${fullPath}.tmp`;
  await fs.writeFile(tmpPath, json, 'utf8');
  await fs.rename(tmpPath, fullPath);
}

export async function listBackups(relativePath: string): Promise<string[]> {
  const base = `${relativePath.replace(/[\\/]/g, '_')}.`;
  try {
    const files = await fs.readdir(VERSIONS_DIR);
    return files.filter(f => f.startsWith(base)).sort().reverse();
  } catch {
    return [];
  }
}

export async function restoreBackup(relativePath: string, backupFileName: string): Promise<void> {
  const fullPath = join(DATA_DIR, relativePath);
  const backupPath = join(VERSIONS_DIR, backupFileName);
  const dir = dirname(fullPath);
  await ensureDir(dir);
  const contents = await fs.readFile(backupPath, 'utf8');
  const tmpPath = `${fullPath}.tmp`;
  await fs.writeFile(tmpPath, contents, 'utf8');
  await fs.rename(tmpPath, fullPath);
}


