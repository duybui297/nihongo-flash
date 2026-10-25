import fs from 'fs';
import { DB_VERSION } from '../shared/constants';
import { createSeedData } from '../shared/seed';
import type { AppData, DatabaseSchema } from '../shared/types';
import { config } from './config';

function createDatabase(data: AppData): DatabaseSchema {
  return { version: DB_VERSION, updatedAt: new Date().toISOString(), ...data };
}

/** Atomic write: write to a temp file then rename, so a crash never leaves a half-written DB. */
export function writeDatabase(db: DatabaseSchema): void {
  db.updatedAt = new Date().toISOString();
  const tempFile = `${config.dbFile}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tempFile, config.dbFile);
}

export function readDatabase(): DatabaseSchema {
  if (!fs.existsSync(config.dbFile)) {
    const seeded = createDatabase(createSeedData());
    writeDatabase(seeded);
    return seeded;
  }

  const raw = fs.readFileSync(config.dbFile, 'utf-8');
  try {
    const parsed = JSON.parse(raw) as Partial<DatabaseSchema>;
    return createDatabase({
      decks: Array.isArray(parsed.decks) ? parsed.decks : [],
      cards: Array.isArray(parsed.cards) ? parsed.cards : [],
    });
  } catch (error) {
    // Keep the corrupt file for manual recovery instead of silently overwriting it.
    const backupPath = `${config.dbFile}.corrupt-${Date.now()}`;
    fs.copyFileSync(config.dbFile, backupPath);
    console.error(`[DB] Corrupt database moved to ${backupPath}. Re-seeding.`, error);
    const seeded = createDatabase(createSeedData());
    writeDatabase(seeded);
    return seeded;
  }
}

/** Read → mutate → write in one step. Returns whatever the mutator returns. */
export function updateDatabase<T>(mutator: (db: DatabaseSchema) => T): T {
  const db = readDatabase();
  const result = mutator(db);
  writeDatabase(db);
  return result;
}

export function replaceDatabase(data: AppData): DatabaseSchema {
  const db = createDatabase(data);
  writeDatabase(db);
  return db;
}
