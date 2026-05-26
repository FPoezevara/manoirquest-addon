// ── Notification quotidienne (push add-on → Home Assistant) ──────────────────
// L'add-on appelle lui-même les services notify.mobile_app_* chaque matin via le
// proxy Core du superviseur. Aucune connaissance du hostname interne requise :
// on tape http://supervisor/core/api avec le SUPERVISOR_TOKEN injecté par HAOS
// (config.yaml → homeassistant_api: true).
//
// Config (env, posés par run.sh depuis les options de l'add-on) :
//   NOTIFY_ENABLED   "true" | "false"
//   NOTIFY_TIME      "HH:MM" (heure locale du conteneur)
//   NOTIFY_TARGETS   CSV des services notify (ex: "mobile_app_iphone_de_francis_2,mobile_app_sm_g998u1")
//   SUPERVISOR_TOKEN injecté automatiquement par le superviseur

import { getDueGroups } from './tasks';

const SUPERVISOR_API = 'http://supervisor/core/api';

interface NotifyConfig {
	token: string | undefined;
	enabled: boolean;
	time: string;
	targets: string[];
}

function readConfig(): NotifyConfig {
	return {
		token: process.env.SUPERVISOR_TOKEN,
		enabled: (process.env.NOTIFY_ENABLED ?? 'true').toLowerCase() !== 'false',
		time: process.env.NOTIFY_TIME ?? '08:00',
		targets: (process.env.NOTIFY_TARGETS ?? '')
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean)
	};
}

// Message à partir du bucket « aujourd'hui » (échéance <= aujourd'hui → inclut les
// retards, ce qui correspond bien aux « tâches à réaliser dans la journée »).
export function buildTodayMessage(): { title: string; message: string; count: number } {
	const today = getDueGroups().find((g) => g.key === 'today');
	const items = today?.items ?? [];
	const title = '🧹 ManoirQuest — Tâches du jour';

	if (items.length === 0) {
		return { title, message: 'Rien de prévu aujourd’hui 🎉', count: 0 };
	}

	const header = `${items.length} tâche${items.length > 1 ? 's' : ''} à faire aujourd’hui :`;
	const lines = items.map((it) => `• ${it.task.emoji} ${it.task.name} (${it.task.points} pts)`);
	return { title, message: [header, ...lines].join('\n'), count: items.length };
}

async function postNotify(target: string, title: string, message: string, token: string): Promise<void> {
	try {
		const res = await fetch(`${SUPERVISOR_API}/services/notify/${target}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, message })
		});
		if (!res.ok) {
			const body = await res.text().catch(() => '');
			console.error(`[notify] ${target} → HTTP ${res.status} ${body}`);
		} else {
			console.log(`[notify] envoyé à ${target}`);
		}
	} catch (e) {
		console.error(`[notify] échec d'appel à ${target}:`, e);
	}
}

// Envoie la notif du jour à toutes les cibles configurées. Renvoie le message
// construit (utile pour l'endpoint de test).
export async function sendDailyNotification(): Promise<{ title: string; message: string; count: number; targets: string[] }> {
	const { token, targets } = readConfig();
	const built = buildTodayMessage();

	if (!token) {
		console.error('[notify] SUPERVISOR_TOKEN absent — homeassistant_api activé et add-on lancé sous HAOS ?');
		return { ...built, targets: [] };
	}
	if (targets.length === 0) {
		console.error('[notify] aucune cible configurée (notify_targets vide)');
		return { ...built, targets: [] };
	}

	await Promise.all(targets.map((t) => postNotify(t, built.title, built.message, token)));
	return { ...built, targets };
}

// ── Scheduler quotidien ───────────────────────────────────────────────────────
// Recalcule l'échéance après chaque tir (robuste au DST, pas d'accumulation de
// dérive). setTimeout suffit : le délai est toujours < 24 h, bien sous la limite
// des ~24,8 jours de Node.
let started = false;

function msUntilNext(hh: number, mm: number): { delay: number; at: Date } {
	const now = new Date();
	const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0, 0);
	if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
	return { delay: next.getTime() - now.getTime(), at: next };
}

export function startDailyNotificationScheduler(): void {
	if (started) return; // idempotent : un seul scheduler par process
	started = true;

	const { enabled, time, token } = readConfig();

	if (!enabled) {
		console.log('[notify] scheduler désactivé (notify_enabled=false)');
		return;
	}
	if (!token) {
		// Hors HAOS (dev local) : pas de token → on n'arme pas le scheduler.
		console.log('[notify] pas de SUPERVISOR_TOKEN — scheduler inactif (hors HAOS ?)');
		return;
	}

	const [rawH, rawM] = time.split(':');
	const hh = Math.min(23, Math.max(0, Number(rawH) || 8));
	const mm = Math.min(59, Math.max(0, Number(rawM) || 0));

	const armNext = () => {
		const { delay, at } = msUntilNext(hh, mm);
		console.log(`[notify] prochaine notif: ${at.toLocaleString('fr-FR')} (dans ${Math.round(delay / 60000)} min)`);
		setTimeout(() => {
			sendDailyNotification()
				.catch((e) => console.error('[notify] erreur durant l’envoi:', e))
				.finally(armNext); // reprogramme le lendemain
		}, delay);
	};

	armNext();
}
