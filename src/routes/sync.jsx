import toast from "react-hot-toast";
import { syncDB } from "../db";
import Toast from "../components/Toast";

export async function action() {
  try {
    const response = await syncDB();
    toast.custom(() => (
      <Toast message={response.message} color="green" />
    ));
  } catch (error) {
    toast.custom(() => (
      <Toast message={error.message} color="red" />
    ));
  }
  return null;
}
