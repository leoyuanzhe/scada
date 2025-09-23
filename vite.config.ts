import { resolve } from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";

// https://vite.dev/config/
export default defineConfig({
	base: "/scada",
	server: {
		host: true,
		proxy: {},
	},
	resolve: {
		alias: { "@": resolve(import.meta.dirname, "src") },
		extensions: [".js", ".ts", ".tsx"],
	},
	plugins: [vue(), vueJsx()],
});
