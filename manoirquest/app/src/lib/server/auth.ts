import { createHash, randomBytes } from 'crypto';
import { all, get, run } from '$lib/db';
import type { User, Session } from '$lib/db/schema';

const SECRET = process.env.SECRET_KEY ?? 'change-me-please';
const SESSION_TTL_HOURS = 72;

export function hashPin(pin: string): string {
	return createHash('sha256').update(pin + SECRET).digest('hex');
}

export function generateSessionId(): string {
	return randomBytes(32).toString('hex');
}

export function verifyPin(userId: number, pin: string): User | null {
	const user = get<User>('SELECT * FROM users WHERE id = ?', userId);
	if (!user) return null;
	if (user.pin_hash !== hashPin(pin)) return null;
	return user;
}

export function createSession(userId: number): string {
	// Purge sessions expirées
	run("DELETE FROM sessions WHERE expires_at < datetime('now')");

	const id = generateSessionId();
	const expiresAt = new Date(Date.now() + SESSION_TTL_HOURS * 3_600_000).toISOString();
	run('INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)', id, userId, expiresAt);
	return id;
}

export function getSessionUser(sessionId: string): User | null {
	if (!sessionId) return null;
	const session = get<Session>('SELECT * FROM sessions WHERE id = ?', sessionId);
	if (!session) return null;
	if (new Date(session.expires_at) < new Date()) {
		run('DELETE FROM sessions WHERE id = ?', sessionId);
		return null;
	}
	return get<User>('SELECT * FROM users WHERE id = ?', session.user_id);
}

export function deleteSession(sessionId: string): void {
	run('DELETE FROM sessions WHERE id = ?', sessionId);
}

export function getWeekStart(date = new Date()): string {
	const d = new Date(date);
	const day = d.getDay(); // 0=Sun
	const diff = day === 0 ? -6 : 1 - day; // recule au lundi
	d.setDate(d.getDate() + diff);
	return d.toISOString().slice(0, 10);
}
