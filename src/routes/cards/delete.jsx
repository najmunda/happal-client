import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { logError } from "../../utils/logger";
import { deleteCardDoc } from "./db";
import { compactDB } from "../../db";

export async function action({ params }) {
  let success = false;
  try {
    const response = await deleteCardDoc(params.cardId);
    toast.custom(() => <Toast message={response.message} type="success" />);
    success = true;
    await compactDB();
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal dihapus";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return { success };
}
