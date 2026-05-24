import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import {
	listPlayers, getPlayer, getUserBadges, getAvailableRewards,
	getUserClaims, levelProgress, claimReward
} from '$lib/server/players';

export const load: PageServerLoad = async ({ url }) => {
	const players = listPlayers();
	const selectedId = Number(url.searchParams.get('u')) || players[0]?.id;
	const player = getPlayer(selectedId);

	return {
		selectedId,
		player,
		badges: getUserBadges(selectedId),
		rewards: getAvailableRewards(),
		claims: getUserClaims(selectedId),
		progress: player ? levelProgress(player.totalPoints) : { level: 1, nextLevelPts: 50, progressPct: 0 }
	};
};

export const actions: Actions = {
	claimReward: async ({ request }) => {
		const data = await request.formData();
		const rewardId = Number(data.get('rewardId'));
		const userId = Number(data.get('userId'));
		if (!rewardId || !userId) return fail(400, { error: 'Sélection invalide' });
		try {
			claimReward(rewardId, userId);
		} catch (e: unknown) {
			return fail(400, { error: (e as Error).message });
		}
		return { success: true };
	}
};
