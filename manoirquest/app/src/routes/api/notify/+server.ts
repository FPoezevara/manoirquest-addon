import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { buildTodayMessage, sendDailyNotification } from '$lib/server/notify';

// GET  /api/notify  → aperçu du message du jour (ne pousse rien).
export const GET: RequestHandler = async () => {
	return json(buildTodayMessage());
};

// POST /api/notify  → envoie immédiatement la notif aux cibles configurées.
// Pratique pour tester sans attendre l'heure programmée :
//   curl -X POST http://<addon>:3000/api/notify
export const POST: RequestHandler = async () => {
	const result = await sendDailyNotification();
	return json({ ok: result.targets.length > 0, ...result });
};
