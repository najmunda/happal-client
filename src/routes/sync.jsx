import toast from "react-hot-toast";
import { syncDB } from "../db";
import Toast from "../components/Toast";
import { logError } from "../utils/logger";

export async function action() {
  try {
    const response = await syncDB();
    toast.custom(() => <Toast message={response.message} type="success" />);
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Terjadi eror saat sinkronisasi";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return null;
}
