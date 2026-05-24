// @ts-nocheck
import type { PageServerLoad } from './$types';
import { getLeaderboard, resetWeeklyIfNeeded } from '$lib/server/players';

export const load = async () => {
	resetWeeklyIfNeeded();
	return getLeaderboard(); // { weekly, allTime }, badges inclus par joueur
};
;null as any as PageServerLoad;