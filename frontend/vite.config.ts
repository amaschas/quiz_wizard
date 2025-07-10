import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import biomePlugin from "vite-plugin-biome";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());
	return {
		plugins: [react(), biomePlugin(), tsconfigPaths()],
		server: {
			watch: {
				ignored: ["**/build/**"],
			},
			host: '0.0.0.0',
			port: +(env.VITE_FRONTEND_SERVER_PORT ?? 3000),
			strictPort: true,
		},
		envDir: "../.", // use .env files from the monorepo root
	};
});
