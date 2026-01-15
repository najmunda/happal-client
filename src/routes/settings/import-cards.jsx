import toast from "react-hot-toast";
import { logError } from "../../utils/logger";
import Toast from "../../components/Toast";
import { importCardDocs } from "./db";

export async function action({ request }) {
  try {
    const formData = await request.formData();
    let response = await importCardDocs(formData.get("file"));
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
      : "Terjadi galat saat mengimpor file";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return null;
}
