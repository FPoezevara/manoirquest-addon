import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

// L'authentification PIN a été retirée — cette route ne sert plus.
// On redirige vers l'accueil (en restant sous le préfixe d'ingress).
export const load: PageServerLoad = async ({ locals }) => {
	throw redirect(307, `${locals.base}/`);
};
