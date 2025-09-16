import { useCallback, useEffect, useRef, useState } from "react";
import { Interweave } from "interweave";
import { CopyX, Pickaxe, Smile, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  Outlet,
  useLoaderData,
  useNavigate,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";
import { getCardDocTotal, getSorbData, updateSRS } from "../../db";
import CardsCounter from "../../components/CardsCounter";
import { logError } from "../../utils/logger";

export async function loader() {
  const { payload: cardDocsTotal } = await getCardDocTotal();
  const {
    payload: { topCardDoc, nextReview, todayCardsLeft },
  } = await getSorbData(cardDocsTotal);
  return { topCardDoc, nextReview, todayCardsLeft, cardDocsTotal };
}

export async function action({ request }) {
  try {
    const { cardId, rating } = await request.json();
    await updateSRS(cardId, rating);
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "SRS kartu gagal diperbarui";
    toast.custom(() => <Toast message={error.message} type="error" />);
  }
  return null;
}

export default function Sorb() {
  const { topCardDoc, nextReview, todayCardsLeft, cardDocsTotal } =
    useLoaderData();
  const [isOpen, setIsOpen] = useState(false);
  const submit = useSubmit();
  const mainDivRef = useRef();
  const currentCardRef = useRef();
  const initialCardRectRef = useRef();
  const nextCardRef = useRef();
  const navigation = useNavigation();

  // Handlers

  let firstTouchX = null;
  let swiped = false;
  const leftZoneThreshold = window.screen.width / 4;
  const rightZoneThreshold = (window.screen.width * 3) / 4;

  function getTouches(e) {
    return e.touches;
  }

  function handleTouchStart(e) {
    const firstTouch = getTouches(e)[0];
    firstTouchX = firstTouch.clientX;
  }

  function handleTouchMove(e) {
    if (!firstTouchX || swiped || !isOpen) {
      return;
    }

    const secondTouch = getTouches(e)[0];
    const touchXDiff = secondTouch.clientX - firstTouchX;

    currentCardRef.current.animate(
      {
        transform: `translateX(${touchXDiff}px)`,
      },
      {
        duration: 200,
        fill: "forwards",
      },
    );
  }

  function handleTouchEnd(e) {
    if (!firstTouchX || swiped || !isOpen) {
      return;
    }

    const endTouch = e.changedTouches[0];

    if (
      firstTouchX < rightZoneThreshold &&
      endTouch.clientX > rightZoneThreshold
    ) {
      swiped = true;
      handleCardRight();
    } else if (
      firstTouchX > leftZoneThreshold &&
      endTouch.clientX < leftZoneThreshold
    ) {
      swiped = true;
      handleCardLeft();
    } else {
      // Translate to initial position
      currentCardRef.current.animate(
        {
          transform: `translateX(${initialCardRectRef.current.x - parseFloat(getComputedStyle(mainDivRef.current).paddingLeft)}px)`,
          opacity: 1,
        },
        {
          duration: 200,
          fill: "forwards",
        },
      );
    }
  }

  useEffect(() => {
    if (currentCardRef.current) {
      initialCardRectRef.current =
        currentCardRef.current.getBoundingClientRect();
    }
  }, []);

  function handleCardRight() {
    if (isOpen) {
      // Translate to right out of screen then do submit
      Promise.allSettled([
        currentCardRef.current.animate(
          {
            transform: `translateX(${initialCardRectRef.current.width}px)`,
            opacity: 0,
          },
          {
            duration: 200,
            fill: "forwards",
          },
        ).finished,
        nextCardRef.current.animate(
          {
            transform: "scale(1)",
            opacity: 1,
          },
          {
            duration: 200,
            fill: "forwards",
          },
        ).finished,
      ]).then(() => {
        submit(
          { cardId: topCardDoc._id, rating: 1 },
          { method: "post", encType: "application/json" },
        );
        setTimeout(() => setIsOpen(false), 100);
      });
    }
  }

  function handleCardLeft() {
    if (isOpen) {
      // Translate to left out of screen then do submit
      Promise.allSettled([
        currentCardRef.current.animate(
          {
            transform: `translateX(-${initialCardRectRef.current.width}px)`,
            opacity: 0,
          },
          {
            duration: 200,
            fill: "forwards",
          },
        ).finished,
        nextCardRef.current.animate(
          {
            transform: "scale(1)",
            opacity: 1,
          },
          {
            duration: 200,
            fill: "forwards",
          },
        ).finished,
      ]).then(() => {
        submit(
          { cardId: topCardDoc._id, rating: 0 },
          { method: "post", encType: "application/json" },
        );
        setTimeout(() => setIsOpen(false), 100);
      });
    }
  }

  useEffect(() => {
    if (nextCardRef.current) {
      nextCardRef.current
        .getAnimations()
        .forEach((animation) => animation.cancel());
    }
  }, [topCardDoc]);

  function handleCardClick() {
    setIsOpen(true);
  }

  const handleKeyUp = useCallback(
    (e) => {
      if (isOpen) {
        if (e.key == "ArrowLeft") {
          handleCardLeft();
        } else if (e.key == "ArrowRight") {
          handleCardRight();
        }
      } else if (e.key == "Spacebar" || e.key == " ") {
        handleCardClick();
      }
    },
    [isOpen],
  );

  useEffect(() => {
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyUp]);

  // Loading
  const isLoading =
    navigation.state == "submitting" || navigation.state == "loading";

  // Dialog

  const dialogRef = useRef();
  const navigate = useNavigate();

  function handleDialogClose() {
    dialogRef.current.close();
  }

  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      dialogRef.current.close();
      navigate("/sorb");
    }
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      dialogRef.current.close();
      navigate("/sorb");
    }
  }

  useEffect(() => {
    if (location.pathname !== "/sorb") {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [location.pathname]);

  return (
    <main
      ref={mainDivRef}
      className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}
    >
      {todayCardsLeft.learn.length != 0 ||
      todayCardsLeft.new.length != 0 ||
      todayCardsLeft.review.length != 0 ? (
        <>
          <div className="flex-1 w-full flex flex-col justify-center items-center relative">
            {isLoading ? (
              <div
                className={`h-full w-full flex-1 max-w-sm md:max-h-[35rem] p-2 flex flex-col items-center gap-2 justify-center bg-white text-center rounded-lg shadow`}
              >
                <p className="animate-pulse text-neutral-300 bg-neutral-300 rounded-lg">
                  Better use your time to learn!
                </p>
              </div>
            ) : (
              <>
                <div
                  ref={nextCardRef}
                  className={`scale-95 opacity-75 h-full w-full flex-1 max-w-sm md:max-h-[35rem] p-2 flex flex-col items-center gap-2 justify-center bg-white text-center rounded-lg shadow`}
                >
                  <p className="text-neutral-300 bg-neutral-300 rounded-lg">
                    Better use your time to learn!
                  </p>
                </div>
                <div
                  ref={currentCardRef}
                  onClick={handleCardClick}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={handleTouchEnd}
                  className={`absolute h-full w-full flex-1 max-w-sm md:max-h-[35rem] p-2 flex flex-col items-stretch gap-2 justify-around bg-white text-center rounded-lg shadow ${isOpen ? "" : "hover:shadow-md cursor-pointer"}`}
                >
                  {isOpen && (
                    <>
                      <section className="p-2 flex flex-row-reverse items-center gap-2">
                        <button
                          onClick={handleCardRight}
                          className="p-2 flex items-center gap-2 rounded-lg border border-neutral-200 hover:bg-neutral-100"
                        >
                          <ThumbsUp />
                          <p className="text-xs">{nextReview.good}</p>
                          <p className="text-xs">Good</p>
                        </button>
                        <hr className="flex-1 border-neutral-200" />
                      </section>
                      <section className="flex items-center justify-center gap-1 text-neutral-400">
                        <p className="text-xs">
                          Swipe Kanan / Klik tombol &#34;Good&#34; / Tekan{" "}
                          <kbd>{">"}</kbd>{" "}
                        </p>
                      </section>
                    </>
                  )}
                  <div className="flex-1 flex flex-col justify-center items-center gap-2 relative">
                    <p>
                      <Interweave
                        content={topCardDoc.sentence.replace(
                          topCardDoc.target,
                          `<b>${topCardDoc.target}</b>`,
                        )}
                      />
                    </p>
                    {isOpen && (
                      <>
                        <p className="text-2xl font-bold">
                          {topCardDoc.target}
                        </p>
                        <p className="text-sm">{topCardDoc.def}</p>
                      </>
                    )}
                    {!isOpen && (
                      <p className="text-xs text-neutral-400">
                        Tekan <kbd>Space</kbd> / Tap / Klik Kartu untuk membuka
                        definisi dan arti.
                      </p>
                    )}
                  </div>
                  {isOpen && (
                    <>
                      <section className="flex items-center justify-center gap-1 text-neutral-400">
                        <p className="text-xs">
                          Swipe Kiri / Klik tombol &#34;Again&#34; / Tekan{" "}
                          <kbd>{"<"}</kbd>
                        </p>
                      </section>
                      <section className="p-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCardLeft}
                          className="p-2 flex items-center gap-2 rounded-lg border border-neutral-200 hover:bg-neutral-100"
                        >
                          <ThumbsDown />
                          <p className="text-xs">{nextReview.again}</p>
                          <p className="text-xs">Again</p>
                        </button>
                        <hr className="flex-1 border-1 border-neutral-200" />
                      </section>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <CardsCounter
            newTotal={todayCardsLeft.new.length}
            learnTotal={todayCardsLeft.learn.length}
            reviewTotal={todayCardsLeft.review.length}
          />
        </>
      ) : (
        <div className="w-full flex-1 max-w-sm md:max-h-[35rem] p-2 flex flex-col items-center justify-center gap-2 text-center text-neutral-500 rounded-lg border-2 border-neutral-300 border-dashed">
          {cardDocsTotal != 0 ? (
            <>
              <Smile size={80} />
              <p className="text-center text-sm">
                Good Job! Semua kartu sudah direview. Kembali lagi besok!
              </p>
            </>
          ) : (
            <>
              <CopyX size={80} />
              <p className="text-center text-sm">
                Tidak ada kartu tersimpan. Klik{" "}
                <Pickaxe size={18} className="inline" /> &#34;Mine&#34; untuk
                menambah kartu.
              </p>
            </>
          )}
        </div>
      )}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onKeyDown={handleEscDown}
        className="w-full max-h-[75dvh] sm:max-w-sm md:max-w-md bottom-0 rounded-lg"
      >
        <Outlet context={[handleDialogClose]} />
      </dialog>
    </main>
  );
}
