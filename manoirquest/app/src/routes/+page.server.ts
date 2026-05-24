import type { PageServerLoad } from './$types';
import { getAvailableInstances, getRecentDone, getHouseScore } from '$lib/server/tasks';
import { getLeaderboard, resetWeeklyIfNeeded } from '$lib/server/players';

export const load: PageServerLoad = async () => {
	resetWeeklyIfNeeded();

	const { weekly } = getLeaderboard();
	const available = getAvailableInstances();

	return {
		leaderboard: weekly,
		upcoming: available.slice(0, 6),
		upcomingCount: available.length,
		recentDone: getRecentDone(6),
		houseScore: getHouseScore()
	};
};
