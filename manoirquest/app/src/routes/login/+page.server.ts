import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { all } from '$lib/db';
import { verifyPin, createSession } from '$lib/server/auth';
import type { User } from '$lib/db/schema';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) throw redirect(302, `${locals.base}/`);
	const players = all<Pick<User, 'id' | 'name' | 'avatar' | 'role'>>(
		'SELECT id, name, avatar, role FROM users ORDER BY id'
	);
	return { players };
};

export const actions: Actions = {
	login: async ({ request, cookies, locals }) => {
		const data   = await request.formData();
		const userId = Number(data.get('userId'));
		const pin    = String(data.get('pin') ?? '');

		if (!userId || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
			return fail(400, { error: 'PIN invalide (4 chiffres requis)' });
		}

		const user = verifyPin(userId, pin);
		if (!user) return fail(401, { error: 'PIN incorrect. Réessaie !', userId });

		const sessionId = createSession(user.id);
		cookies.set('session', sessionId, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 72 * 3600,
			secure: false // app servie sous ingress (iframe) / LAN — pas de Secure pour éviter les rejets
		});

		throw redirect(302, `${locals.base}/`);
	}
};
