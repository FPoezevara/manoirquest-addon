import * as server from '../entries/pages/leaderboard/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/leaderboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.-E8xa2UH.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
export const stylesheets = [];
export const fonts = [];
