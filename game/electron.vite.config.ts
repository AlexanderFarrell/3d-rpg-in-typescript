import {resolve} from 'path';
import { defineConfig } from "electron-vite";
import config from './vite.config'

export default defineConfig({
	outDir: '../build/out',
	main: {
		build: {
			rollupOptions: {
				input: resolve(__dirname, 'electron/main.ts')
			}
		}
	},
	preload: {
		build: {
			rollupOptions: {
				input: resolve(__dirname, 'electron/preload.ts'),
				output: {
					format: 'cjs',
					entryFileNames: '[name].js'
				}
			}
		}
	},
	renderer: {
		...config,
		root: resolve(__dirname, '.'),
		build: {
			rollupOptions: {
				input: resolve(__dirname, 'index.html')
			}
		}
	}
})