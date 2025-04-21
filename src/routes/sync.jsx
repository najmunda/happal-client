import { syncDB } from "../db";

export async function action() {
  const response = await syncDB();
  console.log('sync: ', response);
  return response;
  // await new Promise(r => setTimeout(r, 5000));
  // return 0;
}