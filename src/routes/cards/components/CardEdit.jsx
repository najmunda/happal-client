import { useEffect, useState } from "react";
import { useFetcher } from "react-router-dom";
import { Pencil, X } from "lucide-react";
import { DialogButtons, DialogContent } from "../../../components/Dialog";
import TextArea from "../../../components/TextArea";
import ButtonAction from "../../../components/ButtonAction";
import Input from "../../../components/Input";

export default function CardEdit({ cardDoc, handleBackToDetailDialog }) {
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
    if (fetcher.data?.success && fetcher.state === "idle")
      handleBackToDetailDialog();
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <DialogContent
        as={fetcher.Form}
        method="post"
        action={`${cardDoc._id}/edit`}
        id="edit-form"
        className="pt-2 gap-3"
      >
        <TextArea
          label="kalimat"
          name="sentence"
          id="sentence"
          value={sentence}
          onChange={handleSentenceChange}
          onSelect={handleSentenceSelect}
          placeholder="Taruh kalimat disini..."
          required
        ></TextArea>
        <Input
          label="target"
          type="text"
          name="target"
          id="target"
          value={target}
          autoComplete="off"
          placeholder="Ketik/sorot target kata/frasa pada kalimat..."
          readOnly
          required
        />
        <TextArea
          label="definisi"
          name="def"
          id="def"
          value={def}
          onChange={handleDefChange}
          placeholder="Tambah definisi dari kamus..."
          required
        ></TextArea>
      </DialogContent>
      <DialogButtons>
        <ButtonAction
          as="button"
          type="button"
          icon={X}
          onClick={handleBackToDetailDialog}
        >
          Batal
        </ButtonAction>
        <ButtonAction
          as="button"
          form="edit-form"
          type="submit"
          variant="success"
          icon={Pencil}
        >
          Simpan
        </ButtonAction>
      </DialogButtons>
    </>
  );
}
