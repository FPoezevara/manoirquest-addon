import { all, get, run } from '$lib/db';
import type { PlayerDTO, Reward } from '$lib/db/schema';
import { getWeekStart } from './auth';

interface UserRow {
	id: number;
	name: string;
	avatar: string;
	role: 'parent' | 'child';
	weekly_points: number;
	total_points: number;
	level: number;
}

const USER_SELECT = 'SELECT id, name, avatar, role, weekly_points, total_points, level FROM users';

function mapPlayer(r: UserRow, badges: { emoji: string; name: string }[] = []): PlayerDTO {
	return {
		id: r.id,
		name: r.name,
		avatar: r.avatar,
		role: r.role,
		weeklyPoints: r.weekly_points,
		totalPoints: r.total_points,
		level: r.level,
		badges
	};
}

// Remet à zéro les points hebdo des joueurs dont la semaine de référence a changé.
export function resetWeeklyIfNeeded(): void {
	const weekStart = getWeekStart();
	run('UPDATE users SET weekly_points = 0, week_start = ? WHERE week_start != ?', weekStart, weekStart);
}

export function listPlayers(): PlayerDTO[] {
	return all<UserRow>(`${USER_SELECT} ORDER BY id`).map(r => mapPlayer(r));
}

export function getPlayer(userId: number): PlayerDTO | null {
	const r = get<UserRow>(`${USER_SELECT} WHERE id = ?`, userId);
	return r ? mapPlayer(r) : null;
}

function badgesByUser(): Map<number, { emoji: string; name: string }[]> {
	const rows = all<{ user_id: number; emoji: string; name: string }>(`
		SELECT ub.user_id, b.emoji, b.name
		FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
		ORDER BY ub.earned_at
	`);
	const m = new Map<number, { emoji: string; name: string }[]>();
	for (const r of rows) {
		if (!m.has(r.user_id)) m.set(r.user_id, []);
		m.get(r.user_id)!.push({ emoji: r.emoji, name: r.name });
	}
	return m;
}

export function getLeaderboard(): { weekly: PlayerDTO[]; allTime: PlayerDTO[] } {
	const badges = badgesByUser();
	const players = all<UserRow>(USER_SELECT).map(r => mapPlayer(r, badges.get(r.id) ?? []));
	const weekly = [...players].sort((a, b) => b.weeklyPoints - a.weeklyPoints);
	const allTime = [...players].sort((a, b) => b.totalPoints - a.totalPoints);
	return { weekly, allTime };
}

export function getUserBadges(userId: number) {
	return all<{ emoji: string; name: string; description: string; earned_at: string }>(`
		SELECT b.emoji, b.name, b.description, ub.earned_at
		FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
		WHERE ub.user_id = ? ORDER BY ub.earned_at DESC
	`, userId);
}

// Niveau & progression, cohérents avec la formule de tasks.ts :
// level(total) = floor(sqrt(total/50)) + 1  →  seuil du niveau L = 50·(L−1)²
export function levelProgress(totalPoints: number): { level: number; nextLevelPts: number; progressPct: number } {
	const level = Math.floor(Math.sqrt(totalPoints / 50)) + 1;
	const prev = 50 * (level - 1) ** 2;
	const next = 50 * level ** 2;
	const progressPct = Math.min(100, Math.max(0, Math.round(((totalPoints - prev) / (next - prev)) * 100)));
	return { level, nextLevelPts: next, progressPct };
}

export function getAvailableRewards(): Reward[] {
	return all<Reward>('SELECT * FROM rewards WHERE is_active = 1 ORDER BY cost ASC');
}

// ── CRUD récompenses (réglages) ───────────────────────────────────────────────
export function listRewards(): Reward[] {
	return all<Reward>('SELECT * FROM rewards ORDER BY cost ASC, name COLLATE NOCASE');
}

export interface RewardInput {
	id?: number;
	name: string; emoji: string; description: string; cost: number; active?: boolean;
}

export function createReward(input: RewardInput): void {
	const name = input.name.trim();
	if (!name) throw new Error('Le nom est obligatoire');
	run(
		'INSERT INTO rewards (name, emoji, description, cost, is_active) VALUES (?, ?, ?, ?, 1)',
		name, input.emoji?.trim() || '🎁', (input.description ?? '').trim(), Math.max(0, Math.round(input.cost || 0))
	);
}

export function updateReward(input: RewardInput & { id: number; active: boolean }): void {
	const name = input.name.trim();
	if (!name) throw new Error('Le nom est obligatoire');
	run(
		'UPDATE rewards SET name = ?, emoji = ?, description = ?, cost = ?, is_active = ? WHERE id = ?',
		name, input.emoji?.trim() || '🎁', (input.description ?? '').trim(),
		Math.max(0, Math.round(input.cost || 0)), input.active ? 1 : 0, input.id
	);
}

export function deleteReward(rewardId: number): void {
	run('DELETE FROM reward_claims WHERE reward_id = ?', rewardId);
	run('DELETE FROM rewards WHERE id = ?', rewardId);
}

export function getUserClaims(userId: number) {
	return all<{ id: number; status: string; claimed_at: string; reward_emoji: string; reward_name: string; reward_cost: number }>(`
		SELECT rc.id, rc.status, rc.claimed_at,
		       r.emoji AS reward_emoji, r.name AS reward_name, r.cost AS reward_cost
		FROM reward_claims rc JOIN rewards r ON r.id = rc.reward_id
		WHERE rc.claimed_by = ? ORDER BY rc.claimed_at DESC
	`, userId);
}

// Réclamation d'une récompense : on enregistre la demande (approuvée d'office,
// plus de validation parent). Les points NE sont PAS déduits — ils restent un
// score pur pour le classement/niveaux. Le coût sert de palier (canAfford).
export function claimReward(rewardId: number, userId: number): void {
	const reward = get<Reward>('SELECT * FROM rewards WHERE id = ?', rewardId);
	if (!reward) throw new Error('Récompense introuvable');

	const user = get<{ total_points: number }>('SELECT total_points FROM users WHERE id = ?', userId);
	if (!user) throw new Error('Personne inconnue');
	if (user.total_points < reward.cost) {
		throw new Error(`Il faut ${reward.cost} pts (ce joueur en a ${user.total_points})`);
	}

	run("INSERT INTO reward_claims (reward_id, claimed_by, status) VALUES (?, ?, 'approved')", rewardId, userId);
}
