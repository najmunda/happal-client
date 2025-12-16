import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { CopyX, Pickaxe, SearchX } from "lucide-react";
import { getCardDocTotal } from "../../db";
import CardsSettings from "./components/CardsSettings";
import Loading from "../../components/Loading";
import { useEffect, useRef, useState } from "react";
import CardsPagination from "./components/CardsPagination";
import clsx from "clsx";
import { getCardsCustom } from "./db";
import Card from "../../components/Card";
import Dialog from "../../components/Dialog";
import CardDetail from "./components/CardDetail";

export function shouldRevalidate({ nextUrl }) {
  const isRevalidate = nextUrl.pathname === "/cards";
  return isRevalidate;
}

export async function loader({ request }) {
  const { payload: cardDocsTotal } = await getCardDocTotal();
  const url = new URL(request.url);
  const showParams = url.searchParams.getAll("show");
  let searchParams = Object.fromEntries(url.searchParams);
  if (showParams.length) {
    searchParams = { ...searchParams, show: showParams };
  }
  const {
    payload: { cardDocs, isLastPage },
  } = await getCardsCustom(searchParams, cardDocsTotal);
  return {
    cardDocs: cardDocs ?? [],
    cardDocsTotal, // All cards total (nothing excluded)
    searchParams,
    isLastPage,
  };
}

export function Component() {
  const { cardDocs, cardDocsTotal, searchParams, isLastPage } = useLoaderData();
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "loading" ||
    navigation.state === "submitting" ||
    navigation.location?.pathname == location.pathname;
  const navigate = useNavigate();
  const isDialogLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  const [showedCardDoc, setShowedCardDoc] = useState();

  // Dialog
  const dialogRef = useRef();

  function handleDialogOpen(e) {
    let element;
    if (e.target.tagName == "DIV") {
      element = e.target;
    } else if (e.target.parentElement.tagName == "DIV") {
      element = e.target.parentElement;
    }
    if (element) {
      const selectedCardId = element.dataset.cardId;
      setShowedCardDoc(
        cardDocs.find((cardDoc) => cardDoc._id === selectedCardId),
      );
      dialogRef.current.showModal();
    }
  }

  function handleDialogClose() {
    dialogRef.current.close();
    setShowedCardDoc(null);
    if (location.pathname.includes("/help")) {
      const prevPathNQuery = location.state?.prevPathNQuery ?? "/cards";
      navigate(prevPathNQuery);
    }
  }

  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      handleDialogClose();
    }
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      handleDialogClose();
    }
  }

  useEffect(() => {
    if (location.pathname !== "/cards") {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [location.pathname]);

  return (
    <main
      style={{ scrollbarGutter: "stable" }}
      className="container w-dvw md:w-full flex-1 p-2 flex flex-col items-stretch gap-2 overflow-y-auto scrollbar-thin relative"
    >
      {cardDocsTotal != 0 ? (
        <CardsSettings searchParams={searchParams} />
      ) : (
        <></>
      )}
      {isLoading ? (
        <Loading className="flex-1 flex flex-col justify-center items-center" />
      ) : cardDocs.length != 0 ? (
        <section
          onClick={handleDialogOpen}
          className={clsx(
            "flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 content-start",
            {
              "pb-5": isLastPage === false,
            },
          )}
        >
          {cardDocs.map((card) => (
            <Card
              as="div"
              key={card._id}
              data-key={card._id}
              data-card-id={card._id}
              className="group h-min grid grid-cols-2 grid-rows-2 items-center gap-1"
            >
              <p className="text-xl font-bold leading-tight text-nowrap truncate gap-2">
                {card.target}
              </p>
              <p className="text-xs font-light text-nowrap truncate col-span-2">
                {card.sentence}
              </p>
            </Card>
          ))}
        </section>
      ) : cardDocsTotal != 0 ? (
        <section className="p-2 flex-1 flex flex-col justify-center items-center gap-2 text-content-secondary dark:text-content-secondary-dark">
          <SearchX size={80} />
          <p className="text-center text-sm">
            Kartu tidak ditemukan. Coba cari dengan kata lain atau ubah nilai
            filter & sortir.
          </p>
        </section>
      ) : (
        <section className="p-2 flex-1 flex flex-col justify-center items-center gap-2 text-content-secondary dark:text-content-secondary-dark">
          <CopyX size={80} />
          <p className="text-center text-sm">
            Belum ada kartu yang ditambahkan. Klik{" "}
            <Pickaxe size={18} className="inline" /> &#34;Mine&#34; untuk
            menambah kartu.
          </p>
        </section>
      )}
      <CardsPagination searchParams={searchParams} isLastPage={isLastPage} />
      <Dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onKeyDown={handleEscDown}
      >
        {isDialogLoading ? (
          <Loading className="h-[33dvh] flex flex-col justify-center items-center" />
        ) : location.pathname.includes("/help") ? (
          <Outlet context={[handleDialogClose]} />
        ) : (
          showedCardDoc && (
            <CardDetail
              key={showedCardDoc._id}
              showedCardDoc={showedCardDoc}
              handleDialogClose={handleDialogClose}
            />
          )
        )}
      </Dialog>
    </main>
  );
}

Component.displayName = "CardsRoute";
