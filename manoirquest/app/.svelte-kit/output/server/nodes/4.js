import * as server from '../entries/pages/leaderboard/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/leaderboard/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/leaderboard/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.CdJOC0xc.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
export const stylesheets = [];
export const fonts = [];
