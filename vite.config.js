import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/ComputerArchitectureLectures/',
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/components'),
            '@/utils': resolve(__dirname, './src/utils')
        }
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'zustand']
                }
            }
        }
    }
})
