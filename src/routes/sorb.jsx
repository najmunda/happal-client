import { useRef, useState } from "react"
import { Interweave } from "interweave";
import { ChevronsDown, ChevronsUp, CopyX, Pickaxe, Smile } from "lucide-react"
import { useLoaderData, useSubmit } from "react-router-dom";
import Header from "../components/Header"
import { getCards, getTodayCards, updateSRS } from "../db";

export async function loader() {
  const { docs, nextReview } = await getTodayCards();
  const cardsTotal = await getCards();
  return { cards: docs, nextReview, cardsTotal: cardsTotal.rows.length };
}

export async function action({ request }) {
  const { id, rating } = await request.json();
  const result = await updateSRS(id, rating);
  return result;
}

export default function Sorb() {

  const { cards, nextReview, cardsTotal } = useLoaderData();
  //console.log({ cards, nextReview, cardsTotal })
  const topCard = cards.at(0);
  const [isOpen, setIsOpen] = useState(false);
  const submit = useSubmit();
  const currentCardRef = useRef();

  // Handlers

  let firstTouchY = null;
  let swiped = false;

  function getTouches(e) {
    return e.touches;
  }

  function handleTouchStart(e) {
    const firstTouch = getTouches(e)[0];
    firstTouchY = firstTouch.clientY;
  }

  function handleTouchMove(e) {
    if (!firstTouchY || swiped) {
      return;
    }

    const secondTouch = getTouches(e)[0];
    const touchYDiff = secondTouch.clientY - firstTouchY;

    if (touchYDiff > 0) {
      swiped = true;
      handleCardDown();
    } else if (touchYDiff < 0) {
      swiped = true;
      handleCardUp();
    }
  }

  function handleCardUp() {
    if (isOpen) {
      setIsOpen(false);
      submit({ id: topCard._id, rating: 1 }, { method: "post", encType: "application/json" });
    }
  }

  function handleCardDown() {
    if (isOpen) {
      //setCards([...cards.slice(1), cards.at(0)]);
      setIsOpen(false);
      submit({ id: topCard._id, rating: 0 }, { method: "post", encType: "application/json" });
    }
  }

  function handleCardClick() {
    setIsOpen(true);
  }

  return (
    <>
      <Header>

      </Header>
      <main className={`flex-1 flex flex-col justify-center p-2`}>
        {cards.length != 0 ?
          <>
            <div
              ref={currentCardRef}
              onClick={handleCardClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              className="flex-1 p-2 flex flex-col items-center justify-between bg-white text-center rounded-lg border"
            >
              {isOpen &&
                <button className="flex flex-col items-center gap-1">
                  <ChevronsUp />
                  <p className="text-xs">{nextReview.good}</p>
                </button>
              }
              <div className="flex-1 flex flex-col justify-center items-center gap-2">
                <p><Interweave content={topCard.sentence.replace(topCard.target, `<b>${topCard.target}</b>`)} /></p>
                <p className="text-2xl font-bold"><mark className={`${isOpen ? "bg-inherit" : 'text-neutral-300 bg-neutral-300 rounded'}`}>{topCard.target}</mark></p>
                <p className="text-sm"><mark className={`${isOpen ? "bg-inherit" : 'text-neutral-300 bg-neutral-300 rounded'}`}>{topCard.def}</mark></p>
              </div>
              {isOpen &&
                <button className="flex flex-col-reverse items-center gap-1">
                  <ChevronsDown />
                  <p className="text-xs">{nextReview.again}</p>
                </button>
              }
            </div>
          </>
          :
          <div className="flex-1 p-2 flex flex-col items-center justify-center gap-2 text-center text-neutral-400 rounded-lg border-2 border-neutral-300 border-dashed">
            {cardsTotal != 0 ?
              <>
                <Smile size={80} />
                <p className="text-center text-sm">Good Job! All today's card is reviewed. Come back tomorrow!</p>
              </>
              :
              <>
                <CopyX size={80} />
                <p className="text-center text-sm">There is no card added. Go to <Pickaxe size={18} className="inline" /> "Mine" to mining sentence and add some card.</p>
              </>
            }
          </div>
        }
      </main>
    </>
  )
}