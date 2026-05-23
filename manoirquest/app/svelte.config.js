import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			out: 'build',
			precompress: true
		}),
		// HAOS ingress serves at a subpath — this env var is set dynamically
		paths: {
			base: process.env.INGRESS_PATH ?? ''
		}
	}
};

export default config;
