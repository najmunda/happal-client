import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { editCardDoc } from "../../db";
import { logError } from "../../utils/logger";

export async function action({ request, params }) {
  let success;
  try {
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData);
    const response = await editCardDoc(params.cardId, formObject);
    toast.custom(() => <Toast message={response.message} type="success" />);
    success = true;
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal diubah";
    toast.custom(() => <Toast message={error.message} type="error" />);
    success = false;
  }
  return { success };
}
