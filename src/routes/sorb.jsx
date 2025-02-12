import { useRef, useState } from "react"
import { Interweave } from "interweave";
import { ChevronsLeft, ChevronsRight, CopyX, Pickaxe, Smile, ThumbsDown, ThumbsUp } from "lucide-react"
import { useLoaderData, useNavigation, useSubmit } from "react-router-dom";
import anime from "animejs";
import { getCardsTotal, getTodayCards, updateSRS } from "../db";
import Loading from "../components/Loading";

export async function loader() {
  const { docs, nextReview } = await getTodayCards();
  const cardsTotal = await getCardsTotal();
  return { cards: docs, nextReview, cardsTotal };
}

export async function action({ request }) {
  const { id, rating } = await request.json();
  const result = await updateSRS(id, rating);
  return result;
}

export default function Sorb() {

  const { cards, nextReview, cardsTotal } = useLoaderData();
  const topCard = cards.at(0);
  const [isOpen, setIsOpen] = useState(false);
  const submit = useSubmit();
  const currentCardRef = useRef();
  const navigation = useNavigation()

  // Handlers

  let firstTouchX = null;
  let swiped = false;

  function getTouches(e) {
    return e.touches;
  }

  function handleTouchStart(e) {
    const firstTouch = getTouches(e)[0];
    firstTouchX = firstTouch.clientX;
  }

  function handleTouchMove(e) {
    if (!firstTouchX || swiped) {
      return;
    }

    const secondTouch = getTouches(e)[0];
    const touchXDiff = secondTouch.clientX - firstTouchX;

    if (touchXDiff > 0) {
      swiped = true;
      handleCardRight();
    } else if (touchXDiff < 0) {
      swiped = true;
      handleCardLeft();
    }
  }

  function handleCardRight() {
    if (isOpen) {
      setIsOpen(false);
      submit({ id: topCard._id, rating: 1 }, { method: "post", encType: "application/json" });
    }
  }

  function handleCardLeft() {
    if (isOpen) {
      setIsOpen(false);
      submit({ id: topCard._id, rating: 0 }, { method: "post", encType: "application/json" });
    }
  }

  function handleCardClick() {
    setIsOpen(true);
  }

  // Loading
  const isLoading = navigation.state == "submitting" || navigation.state == "loading"

  return (
    <main className={`flex-1 flex flex-col justify-center p-2`}>
      {isLoading ? (
        <Loading className='flex-1 flex flex-col justify-center items-center' /> 
      ) : cards.length != 0 ?
        <>
          <div
            ref={currentCardRef}
            onClick={handleCardClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            className="flex-1 p-2 flex flex-col items-stretch justify-around bg-white text-center rounded-lg border"
          >
            {isOpen &&
              <button className="p-2 flex flex-row-reverse items-center gap-2">
                <ChevronsRight />
                <p className="text-xs">{nextReview.good}</p>
                <hr className="flex-1 border-black" />
                <p className="text-xs">Good</p>
                <ThumbsUp />
              </button>
            }
            <div className="flex-1 flex flex-col justify-center items-center gap-2">
              <p><Interweave content={topCard.sentence.replace(topCard.target, `<b>${topCard.target}</b>`)} /></p>
              <p className="text-2xl font-bold"><mark className={`${isOpen ? "bg-inherit" : 'text-neutral-300 bg-neutral-300 rounded'}`}>{topCard.target}</mark></p>
              <p className="text-sm"><mark className={`${isOpen ? "bg-inherit" : 'text-neutral-300 bg-neutral-300 rounded'}`}>{topCard.def}</mark></p>
            </div>
            {isOpen &&
              <button className="p-2 flex items-center gap-2">
                <ChevronsLeft />
                <p className="text-xs">{nextReview.again}</p>
                <hr className="flex-1 border-1 border-black" />
                <p className="text-xs">Again</p>
                <ThumbsDown />
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
  )
}