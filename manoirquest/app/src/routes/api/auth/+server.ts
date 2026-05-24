import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Endpoint obsolète depuis le retrait de l'authentification PIN — conservé inerte.
export const POST: RequestHandler = async () => json({ ok: true });
