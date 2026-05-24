import { c as claimReward, i as listPlayers, e as getPlayer, l as levelProgress, h as getUserClaims, g as getAvailableRewards, f as getUserBadges } from './players-uz-MVUuf.js';
import { fail } from '@sveltejs/kit';
import './auth-BBzAbgAR.js';
import 'node:sqlite';
import 'fs';
import 'path';

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

var _page_server_ts = /*#__PURE__*/Object.freeze({
	__proto__: null,
	actions: actions,
	load: load
});

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-Bz_q0EXU.js')).default;
const server_id = "src/routes/profile/+page.server.ts";
const imports = ["_app/immutable/nodes/6.BVAWMvDg.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-CPaXMwWi.js.map
