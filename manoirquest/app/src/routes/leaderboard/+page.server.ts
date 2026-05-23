import type { PageServerLoad } from './$types';
import { all } from '$lib/db';
import type { User } from '$lib/db/schema';

export const load: PageServerLoad = async () => {
	const allUsers = all<User>(
		'SELECT id, name, avatar, role, weekly_points, total_points, level FROM users'
	);

	const weekly  = [...allUsers].sort((a, b) => b.weekly_points - a.weekly_points);
	const allTime = [...allUsers].sort((a, b) => b.total_points  - a.total_points);

	return { weekly, allTime };
};
