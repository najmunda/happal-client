import { useRef, useState } from "react"
import { useSubmit } from "react-router-dom"
import CardForm from "../components/CardForm"
import { addCards } from "../db";

export async function action({ request }) {
  const cardsData = await request.json();
  const result = await addCards(cardsData.data);
  return result;
}

export default function Mine() {

  const formContainerRef = useRef()
  const [randomNum, setRandomNum] = useState(Math.floor(Math.random() * 10));
  const [formIndex, setFormIndex] = useState([1]);
  const submit = useSubmit();

  function handleAddButton() {
    setFormIndex([...formIndex, formIndex.at(-1) + 1]);
  }

  function handleSubmitButton() {
    const cardForms = formContainerRef.current.querySelectorAll('form');
    const cardsData = Array.from(cardForms, form => Object.fromEntries(new FormData(form)));
    setRandomNum(Math.floor(Math.random() * 10));
    submit({ data: cardsData }, { method: "post", encType: "application/json" });
  }

  return (
    <>
      <div ref={formContainerRef}>
        {formIndex.map(val => <CardForm key={`${randomNum}${val}`} num={val} />)}
      </div>
      <button type="button" className="p-2 border rounded" onClick={handleAddButton}>Add form</button>
      <button onClick={handleSubmitButton} className="p-2 border rounded">Save Card</button>
    </>
  )
}