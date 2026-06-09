// api/index.js
// Vercel serverless entry point. Vercel turns each file under /api into a
// serverless function; here we simply hand requests to the existing Express
// app. The app is exported (not listening) so it works as a request handler.
import app from "../backend/server.js";

export default app;
