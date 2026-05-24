import { n as get, r as run, t as all } from "../../../chunks/db.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/profile/+page.server.ts
var LEVEL_THRESHOLDS = [
	0,
	100,
	250,
	500,
	1e3,
	2e3,
	4e3,
	8e3
];
var load = async ({ locals }) => {
	const userId = locals.user.id;
	const earnedBadges = all(`
		SELECT ub.*, b.name AS badge_name, b.emoji AS badge_emoji, b.description AS badge_description
		FROM user_badges ub
		JOIN badges b ON b.id = ub.badge_id
		WHERE ub.user_id = ?
		ORDER BY ub.earned_at DESC
	`, userId);
	const availableRewards = all("SELECT * FROM rewards WHERE is_active = 1 ORDER BY cost ASC");
	const myClaims = all(`
		SELECT rc.*, r.name AS reward_name, r.emoji AS reward_emoji, r.cost AS reward_cost
		FROM reward_claims rc
		JOIN rewards r ON r.id = rc.reward_id
		WHERE rc.claimed_by = ?
		ORDER BY rc.claimed_at DESC
	`, userId);
	const pts = locals.user.total_points;
	const nextLevelPts = LEVEL_THRESHOLDS.find((l) => l > pts) ?? null;
	const prevLevelPts = [...LEVEL_THRESHOLDS].reverse().find((l) => l <= pts) ?? 0;
	return {
		earnedBadges,
		availableRewards,
		myClaims,
		nextLevelPts,
		progressPct: nextLevelPts ? Math.round((pts - prevLevelPts) / (nextLevelPts - prevLevelPts) * 100) : 100
	};
};
var actions = { claimReward: async ({ request, locals }) => {
	const data = await request.formData();
	const rewardId = Number(data.get("rewardId"));
	const reward = get("SELECT * FROM rewards WHERE id = ?", rewardId);
	if (!reward) return fail(404, { error: "Récompense introuvable" });
	if (locals.user.total_points < reward.cost) return fail(400, { error: `Il te faut ${reward.cost} pts (tu en as ${locals.user.total_points})` });
	run("INSERT INTO reward_claims (reward_id, claimed_by, status) VALUES (?, ?, \"pending\")", rewardId, locals.user.id);
} };
//#endregion
export { actions, load };
