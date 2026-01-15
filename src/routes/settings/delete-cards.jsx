import toast from "react-hot-toast";
import { compactDB } from "../../db";
import { logError } from "../../utils/logger";
import { deleteAllCardDoc } from "./db";
import Toast from "../../components/Toast";

export async function action() {
  try {
    let response = await deleteAllCardDoc();
    if (response?.message) {
      toast.custom(() => (
        <Toast
          message={response.message}
          type={response.success ? "success" : "error"}
        />
      ));
    }
    await compactDB();
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Terjadi galat saat menghapus semua kartu";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return null;
}
