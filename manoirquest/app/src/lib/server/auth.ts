// L'authentification PIN / sessions a été retirée (app en mode kiosque partagé).
// On ne conserve que l'utilitaire de calcul de début de semaine (lundi), utilisé
// par la logique de points hebdomadaires.

export function getWeekStart(date = new Date()): string {
	const d = new Date(date);
	const day = d.getDay(); // 0 = dimanche
	const diff = day === 0 ? -6 : 1 - day; // recule au lundi
	d.setDate(d.getDate() + diff);
	// Format local (pas toISOString/UTC) pour éviter tout décalage d'un jour
	// en fuseau positif (UTC+1/+2) — cohérent avec les dates locales de tasks.ts.
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
