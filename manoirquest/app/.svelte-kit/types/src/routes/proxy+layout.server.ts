// @ts-nocheck
import type { LayoutServerLoad } from './$types';
import { listPlayers } from '$lib/server/players';

export const load = async ({ locals }: Parameters<LayoutServerLoad>[0]) => {
	// base : préfixe d'ingress runtime. players : les 4 joueurs, dispo partout
	// (sélecteurs « qui a fait la tâche » et sélecteur de profil).
	return { base: locals.base, players: listPlayers() };
};
