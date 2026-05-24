import { a as all, b as getWeekStart, r as run, g as get } from './auth-BBzAbgAR.js';

//#region src/lib/server/players.ts
var USER_SELECT = "SELECT id, name, avatar, role, weekly_points, total_points, level FROM users";
function mapPlayer(r, badges = []) {
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
function resetWeeklyIfNeeded() {
	const weekStart = getWeekStart();
	run("UPDATE users SET weekly_points = 0, week_start = ? WHERE week_start != ?", weekStart, weekStart);
}
function listPlayers() {
	return all(`${USER_SELECT} ORDER BY id`).map((r) => mapPlayer(r));
}
function getPlayer(userId) {
	const r = get(`${USER_SELECT} WHERE id = ?`, userId);
	return r ? mapPlayer(r) : null;
}
function badgesByUser() {
	const rows = all(`
		SELECT ub.user_id, b.emoji, b.name
		FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
		ORDER BY ub.earned_at
	`);
	const m = /* @__PURE__ */ new Map();
	for (const r of rows) {
		if (!m.has(r.user_id)) m.set(r.user_id, []);
		m.get(r.user_id).push({
			emoji: r.emoji,
			name: r.name
		});
	}
	return m;
}
function getLeaderboard() {
	const badges = badgesByUser();
	const players = all(USER_SELECT).map((r) => mapPlayer(r, badges.get(r.id) ?? []));
	return {
		weekly: [...players].sort((a, b) => b.weeklyPoints - a.weeklyPoints),
		allTime: [...players].sort((a, b) => b.totalPoints - a.totalPoints)
	};
}
function getUserBadges(userId) {
	return all(`
		SELECT b.emoji, b.name, b.description, ub.earned_at
		FROM user_badges ub JOIN badges b ON b.id = ub.badge_id
		WHERE ub.user_id = ? ORDER BY ub.earned_at DESC
	`, userId);
}
function levelProgress(totalPoints) {
	const level = Math.floor(Math.sqrt(totalPoints / 50)) + 1;
	const prev = 50 * (level - 1) ** 2;
	const next = 50 * level ** 2;
	return {
		level,
		nextLevelPts: next,
		progressPct: Math.min(100, Math.max(0, Math.round((totalPoints - prev) / (next - prev) * 100)))
	};
}
function getAvailableRewards() {
	return all("SELECT * FROM rewards WHERE is_active = 1 ORDER BY cost ASC");
}
function listRewards() {
	return all("SELECT * FROM rewards ORDER BY cost ASC, name COLLATE NOCASE");
}
function createReward(input) {
	const name = input.name.trim();
	if (!name) throw new Error("Le nom est obligatoire");
	run("INSERT INTO rewards (name, emoji, description, cost, is_active) VALUES (?, ?, ?, ?, 1)", name, input.emoji?.trim() || "🎁", (input.description ?? "").trim(), Math.max(0, Math.round(input.cost || 0)));
}
function updateReward(input) {
	const name = input.name.trim();
	if (!name) throw new Error("Le nom est obligatoire");
	run("UPDATE rewards SET name = ?, emoji = ?, description = ?, cost = ?, is_active = ? WHERE id = ?", name, input.emoji?.trim() || "🎁", (input.description ?? "").trim(), Math.max(0, Math.round(input.cost || 0)), input.active ? 1 : 0, input.id);
}
function deleteReward(rewardId) {
	run("DELETE FROM reward_claims WHERE reward_id = ?", rewardId);
	run("DELETE FROM rewards WHERE id = ?", rewardId);
}
function getUserClaims(userId) {
	return all(`
		SELECT rc.id, rc.status, rc.claimed_at,
		       r.emoji AS reward_emoji, r.name AS reward_name, r.cost AS reward_cost
		FROM reward_claims rc JOIN rewards r ON r.id = rc.reward_id
		WHERE rc.claimed_by = ? ORDER BY rc.claimed_at DESC
	`, userId);
}
function claimReward(rewardId, userId) {
	const reward = get("SELECT * FROM rewards WHERE id = ?", rewardId);
	if (!reward) throw new Error("Récompense introuvable");
	const user = get("SELECT total_points FROM users WHERE id = ?", userId);
	if (!user) throw new Error("Personne inconnue");
	if (user.total_points < reward.cost) throw new Error(`Il faut ${reward.cost} pts (ce joueur en a ${user.total_points})`);
	run("INSERT INTO reward_claims (reward_id, claimed_by, status) VALUES (?, ?, 'approved')", rewardId, userId);
}

export { createReward as a, getLeaderboard as b, claimReward as c, deleteReward as d, getPlayer as e, getUserBadges as f, getAvailableRewards as g, getUserClaims as h, listPlayers as i, listRewards as j, levelProgress as l, resetWeeklyIfNeeded as r, updateReward as u };
//# sourceMappingURL=players-uz-MVUuf.js.map
