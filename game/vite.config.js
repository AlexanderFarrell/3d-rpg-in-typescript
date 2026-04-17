import {defineConfig} from "vite";

export default defineConfig({
	server: {
		host: true,
	},
	plugins: [
		{
			name: 'glsl-raw',
			transform(src, id) {
				if (id.endsWith('.glsl')) {
					return { code: `export default ${JSON.stringify(src)}`, map: null };
				}
			}
		}
	]
})