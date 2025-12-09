import { promises as fs } from 'fs';
import { dirname, join } from 'path';

// Get the data directory
// IMPORTANT: For persistence, commit your JSON files to git in the 'data/' directory
// - Committed files ARE persistent (deployed with your code)
// - Runtime-written files are NOT persistent in serverless (filesystem is read-only)
function getDataDir(): string {
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }
  
  // Always use 'data' directory - files committed to git are persistent
  // In serverless, we can READ from committed files, but cannot WRITE at runtime
  // For writes, you'll need to either:
  // 1. Use a database (recommended for production)
  // 2. Commit changes back to git via GitHub API (complex)
  // 3. Use a hybrid: read from committed files, write to external storage
  return 'data';
}

const DATA_DIR = getDataDir();
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
      // Note: In production, committed files in 'data/' are persistent
      // Runtime-written files are not persistent in serverless environments
      if (process.env.NODE_ENV === 'production') {
        console.warn(
          `File ${relativePath} not found. ` +
          `Note: In serverless, only committed files in git are persistent. ` +
          `Runtime writes are lost. Consider using a database for runtime writes.`
        );
      }
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
  
  try {
    await ensureDir(dir);
    await ensureDir(VERSIONS_DIR);
  } catch (err: any) {
    if (err.code === 'EACCES' || err.code === 'EROFS') {
      throw new Error(
        `Permission denied: Cannot write to ${DATA_DIR} in production. ` +
        `In serverless environments, the filesystem is read-only. ` +
        `Committed JSON files in git ARE persistent and can be read. ` +
        `For runtime writes, use a database (PostgreSQL, MongoDB, Supabase). ` +
        `Original error: ${err.message}`
      );
    }
    throw err;
  }

  const json = JSON.stringify(data, null, 2);

  // Backup existing file
  try {
    const existing = await fs.readFile(fullPath, 'utf8');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const versionPath = join(VERSIONS_DIR, `${relativePath.replace(/[\\/]/g, '_')}.${timestamp}.json`);
    await fs.writeFile(versionPath, existing, 'utf8');
  } catch (err: any) {
    // ignore if no existing file or backup fails
    if (err.code !== 'ENOENT') {
      console.warn('Failed to create backup:', err.message);
    }
  }

  // Atomic write via temp file then rename
  try {
    const tmpPath = `${fullPath}.tmp`;
    await fs.writeFile(tmpPath, json, 'utf8');
    await fs.rename(tmpPath, fullPath);
  } catch (err: any) {
    if (err.code === 'EACCES' || err.code === 'EROFS') {
      throw new Error(
        `Permission denied: Cannot write to ${fullPath} in production. ` +
        `The filesystem is read-only in serverless environments. ` +
        `Note: Committed JSON files in git ARE persistent and work for reads. ` +
        `For runtime writes, use a database. ` +
        `Original error: ${err.message}`
      );
    }
    throw err;
  }
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


