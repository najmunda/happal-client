import {
  useActionData,
  useLocation,
  useNavigate,
  useOutletContext,
  useSubmit,
} from "react-router-dom";
import { resetCard } from "../../db";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { logError } from "../../utils/logger";

export async function action({ params, request }) {
  let redirect;
  try {
    ({ redirect } = await request.json());
    const response = await resetCard(params.cardId);
    toast.custom(() => <Toast message={response.message} color="green" />);
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal direset";
    toast.custom(() => <Toast message={error.message} color="red" />);
  }
  return {
    redirect,
  };
}

export default function CardReset() {
  const navigate = useNavigate();
  const actionData = useActionData();
  const submit = useSubmit();
  const location = useLocation();
  const prevPathNQuery = location.state?.prevPathNQuery;
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate(prevPathNQuery);
  }

  function handleSubmit(e) {
    submit(
      { redirect: prevPathNQuery },
      { method: "post", encType: "application/json" },
    );
    e.preventDefault();
  }

  useEffect(() => {
    if (actionData) {
      const { data, redirect } = actionData;
      navigate(redirect, { state: data, replace: true });
    }
  }, [actionData]);

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 h-fit flex flex-col justify-evenly items-center gap-2"
    >
      <p className="text-center">
        Apakah anda yakin untuk mereset jadwal kartu ini?
      </p>
      <div className="pt-2 w-full flex justify-center items-center gap-2">
        <button
          type="button"
          onClick={handleBackButton}
          className="px-2 hover:bg-neutral-100 rounded-lg"
        >
          Batal
        </button>
        <button
          type="submit"
          onClick={handleDialogClose}
          className="px-2 hover:bg-yellow-100 hover:text-yellow-500 rounded-lg"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
