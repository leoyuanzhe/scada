import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	server: {
		proxy: {
			// "/api": "http://xxx",
		},
	},
	resolve: {
		alias: { "@": resolve(import.meta.dirname, "src") },
		extensions: [".js", ".ts", ".tsx"],
	},
	plugins: [vue()],
});
