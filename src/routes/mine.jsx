import { useEffect, useRef, useState } from "react"
import { Navigate, useActionData, useSubmit } from "react-router-dom"
import { SaveAll, SquarePlus } from "lucide-react";
import CardForm from "../components/CardForm"
import { addCards } from "../db";
import Header from "../components/Header";

export async function action({ request }) {
  const requestJson = await request.json();
  const cardsData = requestJson.data;

  // Client Validation
  const errors = []
  for (const cardData of cardsData) {
    if (Object.values(cardData).includes("")) {
      errors.push(cardData.name);
    }
  }

  if (errors.length == 0) {
    const result = await addCards(cardsData);
    return { success: true, errors };
  } else { // There empty input
    return { success: false, errors };
  }
}

export default function Mine() {

  const formContainerRef = useRef()
  const [randomNum, setRandomNum] = useState(Math.floor(Math.random() * 10));
  const [formIndexes, setFormIndexes] = useState([1]);
  const { success, errors } = useActionData() || {};
  const submit = useSubmit();

  function handleAddButton() {
    setFormIndexes([...formIndexes, formIndexes.at(-1) + 1]);
  }

  function handleSubmitButton() {
    const cardForms = formContainerRef.current.querySelectorAll('form');
    const cardsData = Array.from(cardForms, form => Object.assign(Object.fromEntries(new FormData(form)), { name: form.name }));
    submit({ data: cardsData }, { method: "post", encType: "application/json" });
  }

  function handleCardsButtons(e) {
    if (e.target.tagName == "BUTTON") {
      const deletedFormIndex = e.target.parentElement.parentElement.dataset.formindex;
      setFormIndexes(formIndexes.filter(formIndex => formIndex != deletedFormIndex));
    }
  }

  useEffect(() => {
    if (success) {
      setFormIndexes([1]);
      setRandomNum(Math.floor(Math.random() * 10));
    }
  }, [success]);

  return (
    <>
      <Header>
        <button onClick={handleAddButton} className="h-fit"><SquarePlus size={20} /></button>
        <button onClick={handleSubmitButton} className="h-fit"><SaveAll size={20} /></button>
      </Header>
      <main ref={formContainerRef} onClick={handleCardsButtons} className="flex-1 p-2 flex flex-col gap-2">
        {formIndexes.map(formIndex =>
          <CardForm
            key={`${randomNum}${formIndex}`}
            formIndex={formIndex}
            cardCount={formIndexes.length}
            isError={errors ? errors.includes(`card_${formIndex}`) : false}
          />
        )}
        <div className="p-4 flex flex-col justify-center items-center gap-2 text-center text-neutral-500 border border-dashed rounded-lg">
          <p>Click <SquarePlus size={18} className="inline" /> to input another card.</p>
          <p>Click <SaveAll size={18} className="inline" /> to save all inputed cards</p>
        </div>
        {success && <Navigate to={"/mine"} />}
      </main>
    </>
  )
}