import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  completeRoutine,
  getDashboard,
  scanObject,
  sendAlert,
  startGame,
  verifyCaregiver,
} from "./routes/carenest";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.get("/api/carenest/dashboard", getDashboard);
  app.post("/api/carenest/caregiver/verify", verifyCaregiver);
  app.post("/api/carenest/routines/:id/complete", completeRoutine);
  app.post("/api/carenest/games/:id/start", startGame);
  app.post("/api/carenest/alerts", sendAlert);
  app.post("/api/carenest/scan", scanObject);

  return app;
}
