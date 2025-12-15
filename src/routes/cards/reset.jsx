import {
  Form,
  useActionData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { logError } from "../../utils/logger";
import { resetCard } from "./db";
import ButtonAction from "../../components/ButtonAction";
import { CalendarSync, X } from "lucide-react";

export async function action({ params, request }) {
  let redirect;
  try {
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData);
    ({ redirect } = formObject);
    const response = await resetCard(params.cardId);
    toast.custom(() => <Toast message={response.message} type="success" />);
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal direset";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return {
    redirect,
  };
}

export default function CardReset() {
  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();
  const actionData = useActionData();
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

  return (
    <Form
      method="post"
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
        Apakah anda yakin untuk mereset jadwal kartu ini?
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
          variant="warning"
          icon={CalendarSync}
          onClick={handleDialogClose}
        >
          Reset
        </ButtonAction>
      </div>
    </Form>
  );
}
