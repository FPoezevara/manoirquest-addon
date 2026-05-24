import { c as getUserClaims, i as getAvailableRewards, l as levelProgress, o as getPlayer, s as getUserBadges, t as claimReward, u as listPlayers } from "../../../chunks/players.js";
import { fail } from "@sveltejs/kit";
//#region src/routes/profile/+page.server.ts
var load = async ({ url }) => {
	const players = listPlayers();
	const selectedId = Number(url.searchParams.get("u")) || players[0]?.id;
	const player = getPlayer(selectedId);
	return {
		selectedId,
		player,
		badges: getUserBadges(selectedId),
		rewards: getAvailableRewards(),
		claims: getUserClaims(selectedId),
		progress: player ? levelProgress(player.totalPoints) : {
			level: 1,
			nextLevelPts: 50,
			progressPct: 0
		}
	};
};
var actions = { claimReward: async ({ request }) => {
	const data = await request.formData();
	const rewardId = Number(data.get("rewardId"));
	const userId = Number(data.get("userId"));
	if (!rewardId || !userId) return fail(400, { error: "Sélection invalide" });
	try {
		claimReward(rewardId, userId);
	} catch (e) {
		return fail(400, { error: e.message });
	}
	return { success: true };
} };
//#endregion
export { actions, load };
