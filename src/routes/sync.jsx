import toast from "react-hot-toast";
import { syncDB } from "../db";
import Toast from "../components/Toast";

export async function action() {
  try {
    const response = await syncDB();
    toast.custom(() => (
      <Toast message="Kartu berhasil disinkronisasi." color="green" />
    ));
    return response;
  } catch (_) {
    toast.custom(() => (
      <Toast message="Terjadi galat saat sinkronisasi. Ulangi." color="red" />
    ));
    return null;
  }
}
