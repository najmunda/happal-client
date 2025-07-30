import { appendLog } from "../db";

export async function logError(error) {
  const now = new Date().toISOString();
  const loggedError = Object.hasOwn(error, "cause") ? error.cause : error;
  const log = {
    timestamp: now,
    level: "error",
    type: "error",
    service: "client",
    message: loggedError?.message ?? "",
    stack: loggedError?.stack ?? "",
    user_agent: window.navigator.userAgent,
  };
  await appendLog(log);
}
