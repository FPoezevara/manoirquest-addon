// L'authentification PIN / sessions a été retirée (app en mode kiosque partagé).
// On ne conserve que l'utilitaire de calcul de début de semaine (lundi), utilisé
// par la logique de points hebdomadaires.

export function getWeekStart(date = new Date()): string {
	const d = new Date(date);
	const day = d.getDay(); // 0 = dimanche
	const diff = day === 0 ? -6 : 1 - day; // recule au lundi
	d.setDate(d.getDate() + diff);
	return d.toISOString().slice(0, 10);
}
