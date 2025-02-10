import { useEffect, useRef, useState } from "react"
import { Navigate, useActionData, useNavigation, useSubmit } from "react-router-dom"
import { SaveAll, SquarePlus } from "lucide-react";
import CardForm from "../components/CardForm"
import { addCards } from "../db";
import Loading from "../components/Loading";

export async function action({ request }) {
  const requestJson = await request.json();
  const cardsData = requestJson.data;

  // Client Validation
  const errors = []
  for (const cardData of cardsData) {
    if (Object.values(cardData.data).includes("")) {
      errors.push(cardData.name);
    }
  }

  if (errors.length == 0) {
    const result = await addCards(cardsData.map(card => card.data));
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
  const navigation = useNavigation();

  function handleAddButton() {
    setFormIndexes(prevFormIndexes => [...prevFormIndexes, prevFormIndexes.at(-1) + 1]);
  }

  function handleSubmitButton() {
    const cardForms = formContainerRef.current.querySelectorAll('form');
    const cardsData = Array.from(cardForms, form => ({ data: Object.fromEntries(new FormData(form)), name: form.name }));
    submit({ data: cardsData }, { method: "post", encType: "application/json" });
  }

  function handleCardsButtons(e) {
    if (e.target.tagName == "BUTTON") {
      const deletedFormIndex = e.target.parentElement.parentElement.dataset.formindex;
      setFormIndexes(prevFormIndexes => prevFormIndexes.filter(formIndex => formIndex != deletedFormIndex));
    }
  }

  useEffect(() => {
    if (success) {
      setFormIndexes([1]);
      setRandomNum(Math.floor(Math.random() * 10));
    }
  }, [success]);

  return success ? (
    <main className="flex-1 p-2 flex flex-col gap-2">
      <Loading className='flex-1 flex flex-col justify-center items-center' />
      <Navigate to={"/mine"} />
    </main>
  ) : (
    <main ref={formContainerRef} className="flex-1 p-2 flex flex-col gap-2">
      {navigation.state === "submitting" || navigation.state === "loading" ? (
        <Loading className='flex-1 flex flex-col justify-center items-center' />
      ) : (
        <>
          <section onClick={handleCardsButtons} className="flex flex-col gap-2">
            {formIndexes.map(formIndex =>
              <CardForm
                key={`${randomNum}${formIndex}`}
                formIndex={formIndex}
                cardCount={formIndexes.length}
                isError={errors ? errors.includes(`card_${formIndex}`) : false}
              />
            )}
          </section>
          <button onClick={handleAddButton} className="p-2 flex items-center justify-center gap-2 bg-white border rounded-lg"><SquarePlus size={20} />Add Form</button>
          <button onClick={handleSubmitButton} className="p-2 flex items-center justify-center gap-2 bg-white border rounded-lg"><SaveAll size={20} />Save Words</button>
        </>
      )}
    </main>
  )
}