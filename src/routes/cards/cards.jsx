import { Link, Outlet, useLoaderData, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { CalendarSync, CopyX, Info, Pickaxe, SearchX, SquarePen, Trash2 } from "lucide-react";
import { getCardsCustom, getCardsTotal } from "../../db";
import CardsSettings from "../../components/CardsSettings";
import Loading from "../../components/Loading";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import Toast from "../../components/Toast";

export function revalidate({nextUrl}) {
  const isRevalidate = nextUrl.pathname === "/cards"
  return isRevalidate;
}

export async function loader({request}) {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams);
  const cardsTotal = await getCardsTotal();
  const cardsData = await getCardsCustom(searchParams);
  return {
    cards : cardsData ?? [],
    cardsTotal, // All cards total (nothing excluded)
    searchParams,
  }; 
}

export default function Cards() {

  const {cards, cardsTotal, searchParams} = useLoaderData();
  const location = useLocation();
  const navigation = useNavigation();
  const isLoading = (navigation.state === "loading" || navigation.state === "submitting") || navigation.location?.pathname == location.pathname;
  const isDialogLoading = navigation.state === "loading" || navigation.state === "submitting"
  const currentPathNQuery = location.pathname + location.search;

  // Dialog

  const dialogRef = useRef();
  const navigate = useNavigate();

  function handleDialogOpen(e) {
    if (e.target.tagName == 'A') {
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
    };
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      dialogRef.current.close();
      navigate(-1);
    };
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
      const {action} =  location.state;
      toast.custom((t) => {
        if (action == "delete") {
          return <Toast message="Kartu Dihapus" color="red" />
        } else if (action == "reset") {
          return <Toast message="Kartu Direset" color="yellow" />
        } else if (action == "edit") {
          return <Toast message="Kartu Diedit" color="green" />
        }
      });
      history.replaceState(location.state, '');
    }
  }, [location]);

  return (
    <main className='container w-dvw md:w-full flex-1 p-2 flex flex-col items-stretch gap-2'>
      {cardsTotal != 0 ? <CardsSettings searchParams={searchParams} /> : <></>}
      {isLoading ? 
        <Loading className='flex-1 flex flex-col justify-center items-center' /> 
        : cards.length != 0 ? (
          <section onClick={handleDialogOpen} className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2'>
            {cards.map(card => (
              <div key={card._id} data-key={card._id} className="group h-min px-4 py-2 grid grid-cols-2 grid-rows-2 items-center gap-1 bg-white rounded-lg shadow hover:shadow-md">
                <p className="text-xl font-bold leading-tight text-nowrap truncate gap-2">{card.target}</p>
                <p className="text-xs font-light text-nowrap truncate col-span-2">{card.sentence}</p>
                <div className="col-span-2 flex justify-evenly text-xs">
                  <Link className="px-2 py-1 flex gap-1 rounded-lg hover:bg-green-100 hover:text-green-500" to={`${card._id}`} state={{prevPathNQuery: currentPathNQuery}}><Info size={15} />Info</Link>
                  <Link className="px-2 py-1 flex gap-1 rounded-lg hover:bg-blue-100 hover:text-blue-500" to={`${card._id}/edit`} state={{prevPathNQuery: currentPathNQuery}}><SquarePen size={15} />Edit</Link>
                  {card.srs?.card.state !== 0 && <Link className="px-2 py-1 flex gap-1 rounded-lg hover:bg-yellow-100 hover:text-yellow-500" to={`${card._id}/reset`} state={{prevPathNQuery: currentPathNQuery}}><CalendarSync size={15} />Reset</Link>}
                  <Link className="px-2 py-1 flex gap-1 rounded-lg hover:bg-red-100 hover:text-red-500" to={`${card._id}/delete`} state={{prevPathNQuery: currentPathNQuery}}><Trash2 size={15} /> Hapus</Link>
                </div>
              </div>
            ))}
            <div className="group px-4 py-2 grid grid-cols-2 grid-rows-2 items-center gap-1 bg-white rounded-lg shadow hover:shadow-md">
              <p className="text-xl font-bold leading-tight text-nowrap truncate gap-2">Cards?</p>
              <p className="text-xs font-light text-nowrap truncate col-span-2">Halaman ini untuk mengatur kartu-kartu kamu.</p>
              <div className="col-span-2 flex justify-evenly text-xs">
                <Link className="px-2 py-1 flex gap-1 rounded-lg hover:bg-green-100 hover:text-green-500" to="help"><Info size={15} />Lebih lanjut</Link>
              </div>
            </div>
          </section>
        )
        : cardsTotal != 0 ? (
          <section className="p-2 flex-1 flex flex-col justify-center items-center gap-2 text-neutral-500">
            <SearchX size={80} />
            <p className="text-center text-sm">Kartu tidak ditemukan. Coba cari dengan kata lain atau ubah nilai filter & sortir.</p>
          </section>
        ) : (
          <section className="p-2 flex-1 flex flex-col justify-center items-center gap-2 text-neutral-500">
            <CopyX size={80} />
            <p className="text-center text-sm">Belum ada kartu yang ditambahkan. Klik <Pickaxe size={18} className="inline" /> "Mine" untuk menambah kartu.</p>
          </section>
        )
      }
      <dialog ref={dialogRef} onClick={handleBackdropClick} onKeyDown={handleEscDown} className="w-full max-h-[75dvh] sm:max-w-sm md:max-w-md bottom-0 rounded-lg">
        {isDialogLoading ? (
          <Loading className='h-[33dvh] flex flex-col justify-center items-center' />
        ) : (
          <Outlet context={[handleDialogClose]} />
        )}
      </dialog>
    </main>
  )
}