import toast from "react-hot-toast";
import { logError } from "../../utils/logger";
import { downloadErrorLog } from "./db";
import Toast from "../../components/Toast";

export async function action() {
  try {
    let response = await downloadErrorLog();
    if (response?.message) {
      toast.custom(() => (
        <Toast
          message={response.message}
          type={response.success ? "success" : "error"}
        />
      ));
    }
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Terjadi galat saat mengunduh log";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return null;
}
