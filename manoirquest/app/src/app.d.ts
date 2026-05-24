import type { User } from '$lib/db/schema';

declare global {
	namespace App {
		interface Locals {
			user: User | null;
			/** Préfixe d'URL injecté par l'ingress HA (X-Ingress-Path), '' hors ingress */
			base: string;
		}
		interface PageData {
			user?: User | null;
			/** Préfixe d'ingress propagé aux templates pour construire liens/actions */
			base?: string;
		}
	}
}

export {};
