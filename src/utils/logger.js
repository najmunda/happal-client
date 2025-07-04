import { appendLog } from "../db";

export async function logError(error) {
  const now = new Date().toISOString();
  const log = {
    timestamp: now,
    level: "error",
    type: "error",
    service: "client",
    message: error?.message ?? "",
    stack: error?.stack ?? "",
    user_agent: window.navigator.userAgent,
  };
  await appendLog(log);
}
