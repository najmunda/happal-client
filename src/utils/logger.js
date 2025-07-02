import { appendLog } from "../db";

export async function logError(error) {
  const now = new Date().toISOString();
  const log = {
    level: "error",
    type: "error",
    service: "client",
    message: error?.message ?? "",
    stack: error?.stack ?? "",
    timestamp: now,
  };
  await appendLog(log);
}
