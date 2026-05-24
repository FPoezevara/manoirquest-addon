import * as server from '../entries/pages/tasks/_page.server.ts.js';

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/tasks/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/tasks/+page.server.ts";
export const imports = ["_app/immutable/nodes/6._E7ONWD1.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
export const stylesheets = [];
export const fonts = [];
