import { Link, Outlet, useLoaderData, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { CalendarSync, CopyX, Info, Pickaxe, SearchX, SquarePen, Trash2 } from "lucide-react";
import { getCardsCustom, getCardsTotal } from "../../db";
import CardsSettings from "../../components/CardsSettings";
import Loading from "../../components/Loading";
import { useEffect, useRef } from "react";

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
  const isLoading = (navigation.state === "loading" || navigation.state === "submitting") && navigation.location?.pathname == location.pathname;
  const isDialogLoading = navigation.state === "loading" || navigation.state === "submitting"

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
      navigate('/cards');
    };
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      dialogRef.current.close();
      navigate('/cards');
    };
  }

  useEffect(() => {
    if (location.pathname !== "/cards") {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [location.pathname]);

  return (
    <main className='flex-1 p-2 flex flex-col items-stretch gap-2'>
      {cardsTotal != 0 ? <CardsSettings searchParams={searchParams} /> : <></>}
      {isLoading ? 
        <Loading className='flex-1 flex flex-col justify-center items-center' /> 
        : cards.length != 0 ? (
          <section onClick={handleDialogOpen} className='flex flex-col items-stretch gap-2'>
            {cards.map(card => (
              <div key={card._id} data-key={card._id} className="group px-4 py-2 grid grid-cols-2 grid-rows-2 items-center gap-1 bg-white border rounded-lg">
                <p className="text-xl font-bold leading-tight text-nowrap truncate gap-2">{card.target}</p>
                <p className="text-xs font-light text-nowrap truncate col-span-2">{card.sentence}</p>
                <div className="col-span-2 hidden justify-evenly text-xs group-hover:flex">
                  <Link className="flex gap-1" to={`${card._id}`}><Info size={15} />Info</Link>
                  <Link className="flex gap-1" to={`${card._id}/edit`}><SquarePen size={15} />Edit</Link>
                  <Link className="flex gap-1" to={`${card._id}/reset`}><CalendarSync size={15} />Reset</Link>
                  <Link className="flex gap-1" to={`${card._id}/delete`}><Trash2 size={15} /> Hapus</Link>
                </div>
              </div>
            ))}
          </section>
        )
        : cardsTotal != 0 ? (
          <section className="p-2 flex-1 flex flex-col justify-center items-center text-neutral-400">
            <SearchX size={80} />
            <p className="text-center text-sm">Kartu tidak ditemukan. Coba cari dengan kata lain atau ubah nilai filter & sortir.</p>
          </section>
        ) : (
          <section className="p-2 flex-1 flex flex-col justify-center items-center text-neutral-400">
            <CopyX size={80} />
            <p className="text-center text-sm">Belum ada kartu yang ditambahkan. Klik <Pickaxe size={18} className="inline" /> "Mine" untuk menambah kartu.</p>
          </section>
        )
      }
      <dialog ref={dialogRef} onClick={handleBackdropClick} onKeyDown={handleEscDown} className="w-full bottom-0 border rounded-lg">
        {isDialogLoading ? (
          <Loading className='h-[33dvh] flex flex-col justify-center items-center' />
        ) : (
          <Outlet context={[handleDialogClose]} />
        )}
      </dialog>
    </main>
  )
}