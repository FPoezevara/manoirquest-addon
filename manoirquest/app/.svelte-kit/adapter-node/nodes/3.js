import * as server from '../entries/pages/done/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/done/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/done/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.DaTTkbDF.js","_app/immutable/chunks/lwzunFI7.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/1sAtSMT6.js"];
export const stylesheets = [];
export const fonts = [];
