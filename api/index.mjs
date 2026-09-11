import { app } from '../app.mjs'

// Vercel's Node runtime treats an exported Express app as a request handler.
// No app.listen() here — Vercel manages the HTTP server itself.
export default app
