import { Form, Outlet, useLoaderData } from "react-router-dom";
import { BookA, CalendarPlus, Crosshair, Search, SquareCheck, SquarePen, Trash2, WholeWord } from "lucide-react";
import { getCards } from "../../db";
import { useState } from "react";

export async function loader() {
  const cardsData = await getCards();
  return cardsData.rows.map(row => row.doc);
}

export default function Cards() {

  const cardsData = useLoaderData();
  const [selectedCard, setSelectedCard] = useState([]);
  console.log(selectedCard);

  function formatDate(dateISOString) {
    const date = new Date(dateISOString);
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  function handleCheckBox(e) {
    if (e.target.tagName == "INPUT") {
      const key = e.target.parentElement.parentElement.dataset.key;
      if (e.target.checked == true) {
        setSelectedCard([...selectedCard, key]);
      } else {
        setSelectedCard(selectedCard.filter(cardId => cardId != key));
      }
    }
  }

  return (
    <>
      <div className={`p-2 flex justify-${selectedCard.length ? 'between' : 'end'} items-center`}>
        {
          selectedCard.length ?
            <div className="flex items-center gap-2">
              <p>{selectedCard.length} Selected</p>
            </div> : <></>
        }
        <form action="" className="flex items-center border rounded">
          <input type="search" name="" id="" className="w-full outline-0" />
          <Search />
        </form>
      </div>
      <table className="p-2 w-full table-fixed border rounded">
        <thead>
          <tr>
            <th className="p-2 w-fit"><div className="flex justify-center items-center gap-2"><SquareCheck /></div></th>
            <th className="w-3/12"><div className="flex justify-center items-center gap-2"><WholeWord />Sentence</div></th>
            <th className="w-2/12"><div className="flex justify-center items-center gap-2"><Crosshair />Target</div></th>
            <th className="w-4/12"><div className="flex justify-center items-center gap-2"><BookA />Definition</div></th>
            <th className="w-2/12"><div className="flex justify-center items-center gap-2"><CalendarPlus />Date Updated</div></th>
          </tr>
        </thead>
        <tbody onClick={handleCheckBox}>
          {cardsData.map(card => (
            <tr key={card._id} data-key={card._id} className="group border relative">
              <td className="p-2 text-center"><input type="checkbox" name={`check_${card._id}`} id={`check_${card._id}`} checked={selectedCard.includes(card._id)} readOnly /></td>
              <td className="text-nowrap truncate">{card.sentence}</td>
              <td className="text-center text-nowrap truncate">{card.target}</td>
              <td className="text-nowrap truncate">{card.def}</td>
              <td className="text-center text-nowrap truncate">{formatDate(card.dateUpdated)}</td>
              <td className="h-full absolute right-0">
                {selectedCard.length ?
                  <></> :
                  <div className="h-full px-4 bg-white opacity-0 flex justify-center items-center gap-3 group-hover:opacity-100">
                    <Form action={`${card._id}/edit`} className="flex items-center"><button><SquarePen size={18} /></button></Form>
                    <Form method="post" action={`${card._id}/delete`} className="flex items-center"><button type="submit"><Trash2 size={18} color="red" /></button></Form>
                  </div>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Outlet />
    </>
  )
}