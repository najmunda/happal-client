import { useRef, useState } from "react"
import { Interweave } from "interweave";
import Header from "../components/Header"
import { ChevronsDown, ChevronsUp, Smile } from "lucide-react"

const data = [
  {
    sentence: 'This tutorial will be creating, reading, searching, updating, and deleting data.',
    target: 'searching',
    def: 'thoroughly scrutinizing, especially in a disconcerting way.',
  }
];

export default function Sorb() {

  const [cards, setCards] = useState(data);
  const [isOpen, setIsOpen] = useState(false);
  const currentCardRef = useRef();

  console.log(cards);
  let firstTouchY = null;

  function getTouches(e) {
    return e.touches;
  }

  function handleTouchStart(e) {
    const firstTouch = getTouches(e)[0];
    firstTouchY = firstTouch.clientY;
  }

  function handleTouchMove(e) {
    if (!firstTouchY) {
      return;
    }

    const secondTouch = getTouches(e)[0];
    const touchYDiff = secondTouch.clientY - firstTouchY;

    if (touchYDiff > 0) {
      handleCardUp();
    } else if (touchYDiff < 0) {
      handleCardDown();
    }
  }

  function handleCardUp() {
    if (isOpen) {
      setCards(cards.slice(1));
      setIsOpen(false);
    }
  }

  function handleCardDown() {
    if (isOpen) {
      setCards([...cards.slice(1), cards[0]]);
      setIsOpen(false);
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
                  <p className="text-xs">10m</p>
                </button>
              }
              <div className="flex-1 flex flex-col justify-center items-center gap-2">
                <p><Interweave content={cards[0].sentence.replace(cards[0].target, `<b>${cards[0].target}</b>`)} /></p>
                <p className="text-xl font-bold"><mark className={`${isOpen ? "bg-inherit" : 'text-neutral-300 bg-neutral-300 rounded'}`}>{cards[0].target}</mark></p>
                <p className="text-sm"><mark className={`${isOpen ? "bg-inherit" : 'text-neutral-300 bg-neutral-300 rounded'}`}>{cards[0].def}</mark></p>
              </div>
              {isOpen &&
                <button className="flex flex-col-reverse items-center gap-1">
                  <ChevronsDown />
                  <p className="text-xs">10m</p>
                </button>
              }
            </div>
          </>
          :
          <div className="w-full p-2 flex flex-col gap-2 items-center justify-center text-neutral-500">
            <Smile size={80} />
            <p className="text-center text-sm">Good Job! All today's card is reviewed. Come back tomorrow!</p>
          </div>
        }
      </main>
    </>
  )
}