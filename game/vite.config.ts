import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	build: {
		outDir: '../build/dist'
	},
	server: {
		host: true,
	},
	plugins: [,
		vue(),
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