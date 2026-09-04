import { RequestHandler } from "express";
import type {
  AlertResponse,
  CaregiverVerifyResponse,
  DashboardResponse,
  GameStartResponse,
  ScanResponse,
} from "@shared/api";

const dashboard: DashboardResponse = {
  streak: 5,
  unreadNotifications: 1,
  routines: [
    { id: "medicine", time: "08:00 AM", title: "Morning medicine", detail: "Take 1 tablet with a glass of water", tone: "violet", done: true },
    { id: "teeth", time: "09:00 AM", title: "Brush your teeth", detail: "Bathroom → brush → toothpaste → rinse", tone: "amber", done: false },
    { id: "lunch", time: "12:30 PM", title: "Lunch time", detail: "Have your meal and drink some water", tone: "mint", done: false },
  ],
  games: [
    { id: "identify", title: "What Is This?", text: "Identify familiar objects" },
    { id: "remember", title: "Remember Objects", text: "Train your short-term memory" },
    { id: "order", title: "Right Order", text: "Arrange everyday steps" },
    { id: "shopping", title: "Shopping Game", text: "Remember your grocery list" },
  ],
};

export const getDashboard: RequestHandler = (_req, res) => {
  res.json(dashboard);
};

export const verifyCaregiver: RequestHandler = (req, res) => {
  const authorized = req.body?.code === "2468";
  const response: CaregiverVerifyResponse = {
    authorized,
    message: authorized ? "Caregiver access granted" : "That code is not correct",
  };
  res.status(authorized ? 200 : 401).json(response);
};

export const completeRoutine: RequestHandler = (req, res) => {
  const routine = dashboard.routines.find((item) => item.id === req.params.id);
  if (!routine) {
    res.status(404).json({ message: "Routine not found" });
    return;
  }
  routine.done = true;
  res.json(routine);
};

export const startGame: RequestHandler = (req, res) => {
  const game = dashboard.games.find((item) => item.id === req.params.id);
  if (!game) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  dashboard.streak += 1;
  const response: GameStartResponse = {
    started: true,
    streak: dashboard.streak,
    message: `${game.title} started`,
  };
  res.json(response);
};

export const sendAlert: RequestHandler = (_req, res) => {
  const response: AlertResponse = {
    sent: true,
    message: "Your caregiver and emergency contacts have been notified",
    sentAt: new Date().toISOString(),
  };
  dashboard.unreadNotifications += 1;
  res.status(202).json(response);
};

export const scanObject: RequestHandler = (req, res) => {
  const object = typeof req.body?.object === "string" && req.body.object.trim() ? req.body.object.trim().toLowerCase() : "chair";
  const response: ScanResponse = {
    object,
    message: `This is a ${object}.`,
  };
  res.json(response);
};
