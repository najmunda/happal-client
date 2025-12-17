import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import { Pencil, X } from "lucide-react";
import TextArea from "../../../components/TextArea";
import ButtonAction from "../../../components/ButtonAction";
import Input from "../../../components/Input";

export default function CardEdit({
  cardDoc,
  handleDialogClose,
  handleCancelConfirmDialog,
}) {
  const fetcher = useFetcher();

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
    if (fetcher.data?.success && fetcher.state === "idle") handleDialogClose();
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form
      method="post"
      action={`${cardDoc._id}/edit`}
      className="w-full flex flex-col items-stretch gap-2"
    >
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
          onClick={handleCancelConfirmDialog}
        >
          Batal
        </ButtonAction>
        <ButtonAction as="button" type="submit" variant="success" icon={Pencil}>
          Simpan
        </ButtonAction>
      </div>
    </fetcher.Form>
  );
}
