import { useEffect, useRef, useState } from "react"
import { Navigate, useActionData, useNavigation, useSubmit } from "react-router-dom"
import { SaveAll, SquarePlus } from "lucide-react";
import CardForm from "../components/CardForm"
import { addCards } from "../db";
import Loading from "../components/Loading";
import { createEmptyForm } from "../utils";

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
  const [forms, setForms] = useState([createEmptyForm(1)]);
  const { success, errors } = useActionData() || {};
  const submit = useSubmit();
  const navigation = useNavigation();

  function handleFormChange(changedForm) {
    setForms(prevForms => {
      return prevForms.map(prevForm => {
        return prevForm.index == changedForm.index ? changedForm  : prevForm
      })
    });
  }

  function handleAddButton() {
    setForms(prevFormIndexes => {
      const {index} = prevFormIndexes.at(-1)
      return [...prevFormIndexes, createEmptyForm(index + 1)]
    });
  }

  function handleSubmitButton() {
    const cardForms = formContainerRef.current.querySelectorAll('form');
    const cardsData = Array.from(cardForms, form => ({ data: Object.fromEntries(new FormData(form)), name: form.name }));
    submit({ data: cardsData }, { method: "post", encType: "application/json" });
  }

  function handleCardsButtons(e) {
    if (e.target.tagName == "BUTTON") {
      const deletedFormIndex = e.target.parentElement.parentElement.dataset.formindex;
      setForms(prevFormIndexes => prevFormIndexes.filter(({index}) => index != deletedFormIndex));
    }
  }

  useEffect(() => {
    if (success) {
      setForms([createEmptyForm(1)]);
      setRandomNum(Math.floor(Math.random() * 10));
    }
  }, [success]);

  // Masonry
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const root = document.querySelector(':root');
  const style = window.getComputedStyle(root);
  const column = Number.parseInt(style.getPropertyValue('--column'));

  function resizeWindowHandler() {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', resizeWindowHandler);
    return () => {
      window.removeEventListener('resize', resizeWindowHandler);
    };
  }, [])

  const formsMasonry = forms
    .reduce((array, form, index) => {
      index = index < column ? index : index % column;
      array[index] = [...array[index], form];
      return array
    }, (new Array(column)).fill([]))

  return success ? (
    <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
      <Loading className='flex-1 flex flex-col justify-center items-center' />
      <Navigate to={"/mine"} />
    </main>
  ) : (
    <main ref={formContainerRef} className="container w-dvw md:w-full flex-1 pb-2 px-2 flex flex-col">
      {navigation.state === "submitting" || navigation.state === "loading" ? (
        <Loading className='flex-1 flex flex-col justify-center items-center' />
      ) : (
        <>
          <section className="py-2 flex gap-2 sticky top-14 bg-(--bg-color)">
            <button onClick={handleAddButton} className="p-2 flex-1 flex items-center justify-center gap-2 bg-(--bg-color) border border-[var(--line-color)] rounded-lg"><SquarePlus size={20} />Add Form</button>
            <button onClick={handleSubmitButton} className="p-2 flex-1 flex items-center justify-center gap-2 bg-(--bg-color) border border-[var(--line-color)] rounded-lg"><SaveAll size={20} />Save Words</button>
          </section>
          <section onClick={handleCardsButtons} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {formsMasonry.map((column, index) => (
              <div key={index} className="flex flex-col gap-2 relative">
                {column.map(form =>
                  <CardForm
                    key={`${randomNum}${form.index}`}
                    form={form}
                    cardCount={forms.length}
                    isError={errors ? errors.includes(`card_${form.index}`) : false}
                    handleFormChange={handleFormChange}
                  />
                )}
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  )
}