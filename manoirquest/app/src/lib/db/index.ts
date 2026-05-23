// node:sqlite est intégré à Node 22+ (stable sans flag dans Node 24)
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

const dbPath = process.env.DB_PATH ?? './data/manoirquest.db';
mkdirSync(dirname(dbPath), { recursive: true });

const _db = new DatabaseSync(dbPath);
_db.exec('PRAGMA journal_mode = WAL');
_db.exec('PRAGMA foreign_keys = ON');
_db.exec('PRAGMA synchronous = NORMAL');

// ── Helpers typés ────────────────────────────────────────────────────────────

/** SELECT → tableau de lignes */
export function all<T>(sql: string, ...params: unknown[]): T[] {
	const stmt = _db.prepare(sql);
	return (params.length ? stmt.all(...params) : stmt.all()) as T[];
}

/** SELECT → première ligne ou null */
export function get<T>(sql: string, ...params: unknown[]): T | null {
	const stmt = _db.prepare(sql);
	const result = params.length ? stmt.get(...params) : stmt.get();
	return (result ?? null) as T | null;
}

/** INSERT / UPDATE / DELETE */
export function run(sql: string, ...params: unknown[]): { changes: number; lastInsertRowid: number | bigint } {
	const stmt = _db.prepare(sql);
	return (params.length ? stmt.run(...params) : stmt.run()) as { changes: number; lastInsertRowid: number | bigint };
}

/** DDL / PRAGMA */
export function exec(sql: string): void {
	_db.exec(sql);
}

export { _db as rawDb };
