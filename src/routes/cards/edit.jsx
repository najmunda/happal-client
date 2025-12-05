import { useEffect, useState } from "react";
import {
  Form,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { editCardDoc, getCardDoc } from "../../db";
import TextArea from "../../components/TextArea";
import { CircleAlert, Pencil, X } from "lucide-react";
import { logError } from "../../utils/logger";
import ButtonAction from "../../components/ButtonAction";
import Input from "../../components/Input";

export async function action({ request, params }) {
  let redirect;
  try {
    const formData = await request.formData();
    const formObject = Object.fromEntries(formData);
    ({ redirect } = formObject);
    delete formObject["redirect"];
    const response = await editCardDoc(params.cardId, formObject);
    toast.custom(() => <Toast message={response.message} type="success" />);
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Kartu gagal diubah";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return {
    redirect,
  };
}

export async function loader({ params }) {
  try {
    const { payload: cardDoc } = await getCardDoc(params.cardId);
    return { error: null, cardDoc };
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Detail kartu gagal didapatkan";
    return { error, cardDoc: null };
  }
}

export default function CardEdit() {
  const { error, cardDoc } = useLoaderData();
  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();
  const actionData = useActionData();
  const location = useLocation();
  const prevPathNQuery = location.state?.prevPathNQuery;

  function handleBackButton() {
    handleDialogClose();
    navigate(prevPathNQuery);
  }

  if (error !== null && cardDoc === null) {
    return (
      <section className="h-fit flex flex-col justify-evenly items-center gap-2">
        <CircleAlert size={60} />
        <p className="w-full text-lg text-center">{error.message}.</p>
        <div className="w-full flex justify-center items-center">
          <ButtonAction
            as="button"
            type="button"
            icon={X}
            onClick={handleBackButton}
          >
            Tutup
          </ButtonAction>
        </div>
      </section>
    );
  } else {
    const [sentence, setSentence] = useState(cardDoc.sentence);
    const [target, setTarget] = useState(cardDoc.target);
    const [def, setDef] = useState(cardDoc.def);

    function handleSentenceChange(e) {
      setSentence(e.currentTarget.value);
    }

    function handleSentenceSelect(e) {
      const substring = e.currentTarget.value.substring(
        e.target.selectionStart,
        e.target.selectionEnd,
      );
      if (substring != "") {
        setTarget(substring);
        setDef("");
      }
    }

    function handleDefChange(e) {
      setDef(e.currentTarget.value);
    }

    useEffect(() => {
      if (actionData) {
        const { data, redirect } = actionData;
        navigate(redirect, { state: data });
      }
    }, [actionData]);

    return (
      <Form method="post" className="w-full flex flex-col items-stretch gap-2">
        <input
          type="text"
          name="redirect"
          id="redirect"
          className="hidden"
          defaultValue={prevPathNQuery}
        />
        <TextArea
          type="text"
          name="sentence"
          id="sentence"
          value={sentence}
          onChange={handleSentenceChange}
          onSelect={handleSentenceSelect}
          className="text-center text-xs"
          placeholder="Taruh kalimat disini..."
          required
        ></TextArea>
        <Input
          type="text"
          name="target"
          id="target"
          value={target}
          autoComplete="off"
          className="text-center"
          placeholder="Ketik/sorot target kata/frasa pada kalimat..."
          readOnly
          required
        />
        <TextArea
          type="text"
          name="def"
          id="def"
          value={def}
          onChange={handleDefChange}
          className="text-center text-xs"
          placeholder="Tambah definisi dari kamus..."
          required
        ></TextArea>
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
            variant="success"
            icon={Pencil}
            onClick={handleDialogClose}
          >
            Simpan
          </ButtonAction>
        </div>
      </Form>
    );
  }
}
