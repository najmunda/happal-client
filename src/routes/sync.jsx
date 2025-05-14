import toast from "react-hot-toast";
import { syncDB } from "../db";
import Toast from "../components/Toast";

export async function action() {
  try {
    const response = await syncDB();
    toast.custom((t) => (<Toast message="Kartu berhasil disinkronisasi." color="green" />));
    return response;
  } catch (error) {
    console.log(error);
    toast.custom((t) => (<Toast message="Terjadi galat saat sinkronisasi. Ulangi." color="red" />));
    return null;
  }
}