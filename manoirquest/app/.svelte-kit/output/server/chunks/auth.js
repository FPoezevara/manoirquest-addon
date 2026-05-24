import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "fs";
import { dirname } from "path";
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
//#endregion
//#region src/lib/server/auth.ts
function getWeekStart(date = /* @__PURE__ */ new Date()) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
//#endregion
export { run as i, all as n, get as r, getWeekStart as t };
