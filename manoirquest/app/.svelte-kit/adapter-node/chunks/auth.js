import { n as get, r as run } from "./db.js";
import { createHash, randomBytes } from "crypto";
//#region src/lib/server/auth.ts
var SECRET = process.env.SECRET_KEY ?? "change-me-please";
var SESSION_TTL_HOURS = 72;
function hashPin(pin) {
	return createHash("sha256").update(pin + SECRET).digest("hex");
}
function generateSessionId() {
	return randomBytes(32).toString("hex");
}
function verifyPin(userId, pin) {
	const user = get("SELECT * FROM users WHERE id = ?", userId);
	if (!user) return null;
	if (user.pin_hash !== hashPin(pin)) return null;
	return user;
}
function createSession(userId) {
	run("DELETE FROM sessions WHERE expires_at < datetime('now')");
	const id = generateSessionId();
	run("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)", id, userId, new Date(Date.now() + SESSION_TTL_HOURS * 36e5).toISOString());
	return id;
}
function getSessionUser(sessionId) {
	if (!sessionId) return null;
	const session = get("SELECT * FROM sessions WHERE id = ?", sessionId);
	if (!session) return null;
	if (new Date(session.expires_at) < /* @__PURE__ */ new Date()) {
		run("DELETE FROM sessions WHERE id = ?", sessionId);
		return null;
	}
	return get("SELECT * FROM users WHERE id = ?", session.user_id);
}
function deleteSession(sessionId) {
	run("DELETE FROM sessions WHERE id = ?", sessionId);
}
function getWeekStart(date = /* @__PURE__ */ new Date()) {
	const d = new Date(date);
	const day = d.getDay();
	const diff = day === 0 ? -6 : 1 - day;
	d.setDate(d.getDate() + diff);
	return d.toISOString().slice(0, 10);
}
//#endregion
export { verifyPin as a, getWeekStart as i, deleteSession as n, getSessionUser as r, createSession as t };
