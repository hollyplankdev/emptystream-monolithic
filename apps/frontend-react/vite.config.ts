/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    proxy: {
      /**
       * Setup the frontend dev server so that it re-routes backend requests to our backend dev
       * server.
       */
      "/transmission": {
        target: "http://localhost:3000/transmission",
        rewrite: (path) => path.replace(/^\/transmission/, ""),
      },

      /** Setup the frontend dev server so that it re-routes websockets to our backend dev server. */
      "/stream": {
        target: "ws://localhost:3000/stream",
        rewrite: (path) => path.replace(/^\/stream/, ""),
        ws: true,
      },
    },
  },
});
