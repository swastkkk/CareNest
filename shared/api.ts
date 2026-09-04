export interface DemoResponse {
  message: string;
}

export interface RoutineItem {
  id: string;
  time: string;
  title: string;
  detail: string;
  tone: "violet" | "amber" | "mint";
  done: boolean;
}

export interface GameItem {
  id: string;
  title: string;
  text: string;
}

export interface DashboardResponse {
  routines: RoutineItem[];
  games: GameItem[];
  streak: number;
  unreadNotifications: number;
}

export interface CaregiverVerifyResponse {
  authorized: boolean;
  message: string;
}

export interface AlertResponse {
  sent: boolean;
  message: string;
  sentAt: string;
}

export interface ScanResponse {
  object: string;
  message: string;
}

export interface GameStartResponse {
  started: boolean;
  streak: number;
  message: string;
}
