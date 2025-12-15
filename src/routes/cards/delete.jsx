import {
  Form,
  useActionData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { useEffect } from "react";
import Loading from "../../components/Loading";
import { logError } from "../../utils/logger";
import { deleteCardDoc } from "./db";
import { Trash2, X } from "lucide-react";
import ButtonAction from "../../components/ButtonAction";

export async function action({ params, request }) {
  let redirect;
  try {
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData);
    ({ redirect } = formObject);
    const response = await deleteCardDoc(params.cardId);
    toast.custom(() => <Toast message={response.message} type="success" />);
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal dihapus";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return {
    redirect,
  };
}

export default function CardDelete() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const [handleDialogClose] = useOutletContext();
  const location = useLocation();
  const prevPathNQuery = location.state?.prevPathNQuery ?? "/cards";

  function handleBackButton() {
    handleDialogClose();
    navigate(prevPathNQuery);
  }

  useEffect(() => {
    if (actionData) {
      const { redirect } = actionData;
      navigate(redirect, { replace: true });
    }
  }, [actionData]);

  return actionData ? (
    <Loading className="h-[33dvh] flex flex-col justify-center items-center" />
  ) : (
    <Form
      method="delete"
      className="h-fit flex flex-col justify-evenly items-center gap-2"
    >
      <input
        type="text"
        name="redirect"
        id="redirect"
        className="hidden"
        defaultValue={prevPathNQuery}
      />
      <p className="text-center">
        Apakah anda yakin menghapus kartu ini? Jadwal kartu akan ikut terhapus!
      </p>
      <div className="w-full flex justify-center items-center gap-2">
        <ButtonAction
          as="button"
          type="button"
          icon={X}
          onClick={handleBackButton}
        >
          Batal
        </ButtonAction>
        <ButtonAction
          as="button"
          type="submit"
          variant="danger"
          icon={Trash2}
          onClick={handleDialogClose}
        >
          Hapus
        </ButtonAction>
      </div>
    </Form>
  );
}
