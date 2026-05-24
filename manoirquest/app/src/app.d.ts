declare global {
	namespace App {
		interface Locals {
			/** Préfixe d'URL injecté par l'ingress HA (X-Ingress-Path), '' hors ingress */
			base: string;
		}
		interface PageData {
			/** Préfixe d'ingress propagé aux templates pour construire liens/actions */
			base?: string;
		}
	}
}

export {};
