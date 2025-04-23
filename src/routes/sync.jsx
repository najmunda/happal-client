import { syncDB } from "../db";

export async function action() {
  const response = await syncDB();
  return response;
}