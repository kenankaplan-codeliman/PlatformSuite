import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from 'path';

export default defineConfig({
    plugins: [react()],

    server: {
        port: 5500,
        strictPort: false // Port doluysa başka porta geçmesin
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },

    build: {
        target: "ES2020",
        sourcemap: false,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 1500,

        rollupOptions: {
            output: {
                manualChunks: {

                    vendor: [
                        "react",
                        "react-dom",
                        "react-router-dom"
                    ],

                    // Ant Design core
                    antd: ["antd"],

                    // Icon paketi ayrı 
                    icons: ["@ant-design/icons"],

                    // HTTP client
                    axios: ["axios"]
                }
            }
        }
    },

    optimizeDeps: {
        include: [
            "react",
            "react-dom",
            "react-router-dom",
            "antd",
            "@ant-design/icons",
            "axios"
        ]
    }
});
