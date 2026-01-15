import toast from "react-hot-toast";
import { logError } from "../../utils/logger";
import { downloadAllCardDoc } from "./db";
import Toast from "../../components/Toast";

export async function action() {
  try {
    let response = await downloadAllCardDoc();
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
      : "Terjadi galat saat mengunduh semua kartu";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return null;
}
