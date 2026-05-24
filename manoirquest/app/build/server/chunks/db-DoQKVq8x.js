import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'fs';
import { dirname } from 'path';

//#region src/lib/db/index.ts
var dbPath = process.env.DB_PATH ?? "./data/manoirquest.db";
mkdirSync(dirname(dbPath), { recursive: true });
var _db = new DatabaseSync(dbPath);
_db.exec("PRAGMA journal_mode = WAL");
_db.exec("PRAGMA foreign_keys = ON");
_db.exec("PRAGMA synchronous = NORMAL");
/** SELECT → tableau de lignes */
function all(sql, ...params) {
	const stmt = _db.prepare(sql);
	return params.length ? stmt.all(...params) : stmt.all();
}
/** SELECT → première ligne ou null */
function get(sql, ...params) {
	const stmt = _db.prepare(sql);
	return (params.length ? stmt.get(...params) : stmt.get()) ?? null;
}
/** INSERT / UPDATE / DELETE */
function run(sql, ...params) {
	const stmt = _db.prepare(sql);
	return params.length ? stmt.run(...params) : stmt.run();
}

export { all as a, get as g, run as r };
//# sourceMappingURL=db-DoQKVq8x.js.map
