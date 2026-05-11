import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import analyzeRoute from "./routes/analyze.js";
import { handleUploadError } from "./middleware/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "http://localhost:5173",
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => {
    res.json({
      success: true,
      message: "Resume analyzer API is healthy.",
    });
  });

  app.use("/api/analyze", analyzeRoute);
  app.use(handleUploadError);

  app.use((error, _req, res, _next) => {
    console.error("[server-error]", error);
    res.status(500).json({
      success: false,
      error: "Something went wrong on the server. Please retry.",
    });
  });

  return app;
}

export function startServer(port = Number(process.env.PORT || 5000)) {
  const app = createApp();
  const server = app.listen(port, () => {
    console.log(`Resume analyzer API ready at http://localhost:${port}`);
    console.log(`CORS enabled for http://localhost:5173`);
  });

  function shutdown(signal) {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
      process.exit(0);
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer();
}
