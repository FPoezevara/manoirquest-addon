import type { PageServerLoad } from './$types';
import { getLeaderboard, resetWeeklyIfNeeded } from '$lib/server/players';

export const load: PageServerLoad = async () => {
	resetWeeklyIfNeeded();
	return getLeaderboard(); // { weekly, allTime }, badges inclus par joueur
};
