import { useEffect, useRef, useState } from "react";
import { Form, redirect, useLoaderData, useNavigate } from "react-router-dom";
import { editCard, getCard } from "../../db";

export async function action({ request, params }) {
  const cardsForm = await request.formData();
  const cardsData = Object.fromEntries(cardsForm);
  await editCard(params.cardId, cardsData);
  return redirect('/cards');
}

export async function loader({ params }) {
  const card = await getCard(params.cardId);
  return card;
}

export default function CardEdit() {

  const card = useLoaderData();
  const navigate = useNavigate();

  const [sentence, setSentence] = useState(card.sentence);
  const [target, setTarget] = useState(card.target);
  const [def, setDef] = useState(card.def);

  function handleSentenceChange(e) {
    setSentence(e.currentTarget.value);
  }

  function handleSentenceSelect(e) {
    const substring = e.currentTarget.value.substring(e.target.selectionStart, e.target.selectionEnd);
    if (substring != "") {
      setTarget(substring);
      setDef("");
    }
  }

  function handleDefChange(e) {
    setDef(e.currentTarget.value);
  }

  const dialogRef = useRef();
  useEffect(() => {
    dialogRef.current.showModal();
  }, []);

  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      navigate('/cards');
    };
  }

  function handleEscDown(e) {
    console.log(e.key);
    if (e.key == "Escape") {
      navigate('/cards');
    };
  }

  return (
    <dialog ref={dialogRef} onClick={handleBackdropClick} onKeyDown={handleEscDown} className="w-3/5 h-fit">
      <Form method="post" action="" className="p-3 flex flex-col items-center gap-3 border rounded">
        <h1>Edit Card</h1>
        <textarea
          type="text"
          name="sentence"
          id="sentence"
          value={sentence}
          onChange={handleSentenceChange}
          onSelect={handleSentenceSelect}
          className="w-3/4 text-center text-xl border rounded p-2"
          placeholder="Put sentence here..."
        ></textarea>
        <input
          type="text"
          name="target"
          id="target"
          value={target}
          className="w-3/4 text-center text-lg border rounded p-2"
          placeholder="Highlight some words from sentence..."
          readOnly
        />
        <textarea
          type="text"
          name="def"
          id="def"
          value={def}
          onChange={handleDefChange}
          className="w-3/4 text-center text-md border rounded p-2"
          placeholder="Add def from dictionary..."
        ></textarea>
        <button type="submit" className="p-2 border rounded">Submit</button>
      </Form>
    </dialog>
  )
}