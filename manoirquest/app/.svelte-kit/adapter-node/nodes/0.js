import * as server from '../entries/pages/_layout.server.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/+layout.server.ts";
export const imports = ["_app/immutable/nodes/0.DDvrmQDz.js","_app/immutable/chunks/DUZ7yc7H.js","_app/immutable/chunks/BLUzwq2q.js","_app/immutable/chunks/xihTtKlq.js","_app/immutable/chunks/CKzn0cD3.js"];
export const stylesheets = ["_app/immutable/assets/0.CciMvYd0.css"];
export const fonts = [];
