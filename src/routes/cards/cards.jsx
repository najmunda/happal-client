import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import {
  CalendarSync,
  CopyX,
  Info,
  Pickaxe,
  SearchX,
  SquarePen,
  Trash2,
} from "lucide-react";
import { getCardDocTotal } from "../../db";
import CardsSettings from "./components/CardsSettings";
import Loading from "../../components/Loading";
import { useEffect, useRef } from "react";
import CardsPagination from "./components/CardsPagination";
import clsx from "clsx";
import { getCardsCustom } from "./db";
import ButtonAction from "../../components/ButtonAction";
import Card from "../../components/Card";
import Dialog from "../../components/Dialog";

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
  const isDialogLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  const currentPathNQuery = location.pathname + location.search;

  // Dialog

  const dialogRef = useRef();
  const navigate = useNavigate();

  function handleDialogOpen(e) {
    if (e.target.tagName == "A") {
      dialogRef.current.showModal();
    }
  }

  function handleDialogClose() {
    dialogRef.current.close();
  }

  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      dialogRef.current.close();
      navigate(-1);
    }
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      dialogRef.current.close();
      navigate(-1);
    }
  }

  useEffect(() => {
    if (location.pathname !== "/cards") {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location?.state) {
      // const { action } = location.state;
      // toast.custom(() => {
      //   if (action == "delete") {
      //     return <Toast message="Kartu Dihapus" color="red" />;
      //   } else if (action == "reset") {
      //     return <Toast message="Kartu Direset" color="yellow" />;
      //   } else if (action == "edit") {
      //     return <Toast message="Kartu Diedit" color="green" />;
      //   }
      // });
      history.replaceState(location.state, "");
    }
  }, [location]);

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
              className="group h-min grid grid-cols-2 grid-rows-2 items-center gap-1"
            >
              <p className="text-xl font-bold leading-tight text-nowrap truncate gap-2">
                {card.target}
              </p>
              <p className="text-xs font-light text-nowrap truncate col-span-2">
                {card.sentence}
              </p>
              <div className="col-span-2 flex justify-evenly text-xs">
                <ButtonAction
                  as={Link}
                  variant="success"
                  to={`${card._id}`}
                  state={{ prevPathNQuery: currentPathNQuery }}
                >
                  <Info size={15} />
                  Info
                </ButtonAction>
                <ButtonAction
                  as={Link}
                  variant="success"
                  to={`${card._id}/edit`}
                  state={{ prevPathNQuery: currentPathNQuery }}
                >
                  <SquarePen size={15} />
                  Edit
                </ButtonAction>
                {card.srs?.card.state !== 0 && (
                  <ButtonAction
                    as={Link}
                    variant="warning"
                    to={`${card._id}/reset`}
                    state={{ prevPathNQuery: currentPathNQuery }}
                  >
                    <CalendarSync size={15} />
                    Reset
                  </ButtonAction>
                )}
                <ButtonAction
                  as={Link}
                  variant="danger"
                  to={`${card._id}/delete`}
                  state={{ prevPathNQuery: currentPathNQuery }}
                >
                  <Trash2 size={15} /> Hapus
                </ButtonAction>
              </div>
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
        ) : (
          <Outlet context={[handleDialogClose]} />
        )}
      </Dialog>
    </main>
  );
}

Component.displayName = "CardsRoute";
