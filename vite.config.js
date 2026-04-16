import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'

const logger = createLogger()
const originalWarn = logger.warn.bind(logger)
logger.warn = (msg, options) => {
  if (msg.includes('@import must precede')) return
  originalWarn(msg, options)
}

export default defineConfig({
  plugins: [react()],
  customLogger: logger,
  server: {
    port: 3000,
    open: true,
  },
})
