import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { logError } from "../../utils/logger";
import { resetCard } from "./db";

export async function action({ params }) {
  let success;
  try {
    const response = await resetCard(params.cardId);
    toast.custom(() => <Toast message={response.message} type="success" />);
    success = true;
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal direset";
    toast.custom(() => <Toast message={error.message} type="error" />);
    success = false;
  }
  return { success };
}
