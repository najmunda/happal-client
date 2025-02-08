import { useState } from "react";
import { Form, Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import { CopyX, Info, Pickaxe, SearchX, SlidersHorizontal, SquarePen, Trash2 } from "lucide-react";
import { getCardsCustom, getCardsTotal, searchCards } from "../../db";
import Header from "../../components/Header";
import SearchBar from "../../components/SearchBar";
import CardsOptionDialog from "../../components/CardsOptionDialog";
import Toast from "../../components/Toast";

export async function loader({request}) {
  const url = new URL(request.url);
  const searchParams = Object.fromEntries(url.searchParams);
  const cardsTotal = await getCardsTotal();
  if (searchParams?.q) {
    const cardsData = await searchCards(searchParams.q);
    return {
      cards : cardsData ?? [],
      cardsTotal, // All cards total (nothing excluded)
      searchParams,
    };
  } else {
    const cardsData = await getCardsCustom(searchParams);
    return {
      cards : cardsData?.docs ?? [],
      cardsTotal, // All cards total (nothing excluded)
      searchParams,
    };
  }
}

export default function Cards() {

  const {cards, cardsTotal, searchParams} = useLoaderData();
  const location = useLocation();
  const [isSettingOpen, setIsSettingOpen] = useState(false);

  console.log(cards);

  function handleSettingToggle() {
    setIsSettingOpen(true);
  }

  function handleSettingClose() {
    setIsSettingOpen(false);
  }

  return (
    <>
      <Header>
        {cardsTotal != 0 ?
          <>
            <button className="h-fit" onClick={handleSettingToggle}><SlidersHorizontal size={20} /></button>
          </> : <></>
        }
      </Header>
      <main className={`flex-1 p-2 flex flex-col gap-2 ${cards.length == 0 && 'justify-center items-center text-neutral-400'}`}>
        {cardsTotal != 0 ? <SearchBar searchParams={searchParams} /> : <></>}
        {cards.length != 0 ?
          cards.map(card => (
            <div key={card._id} data-key={card._id} className="group px-4 py-2 grid grid-cols-2 grid-rows-2 items-center gap-1 bg-white border rounded-lg">
              <p className="text-xl font-bold leading-tight text-nowrap truncate gap-2">{card.target}</p>
              <p className="text-xs font-light text-nowrap truncate col-span-2">{card.sentence}</p>
              <div className="col-span-2 hidden justify-evenly text-xs group-hover:flex">
                <Link className="flex gap-1" to={`${card._id}`}><Info size={15} />Info</Link>
                <Form action={`${card._id}/edit`} className="flex items-center"><button className="flex gap-1"><SquarePen size={15} />Edit</button></Form>
                <Form method="post" action={`${card._id}/delete`} className="flex items-center"><button type="submit" className="flex gap-1"><Trash2 size={15} /> Delete</button></Form>
              </div>
            </div>
          ))
          : cardsTotal != 0 ? (
            <section className="p-2 flex-1 flex flex-col justify-center items-center">
              <SearchX size={80} />
              <p className="text-center text-sm">Kartu tidak ditemukan. Coba cari dengan kata lain atau ubah nilai filter & sortir.</p>
            </section>
          ) : (
            <section className="p-2 flex-1 flex flex-col justify-center items-center">
              <CopyX size={80} />
              <p className="text-center text-sm">Belum ada kartu yang ditambahkan. Klik <Pickaxe size={18} className="inline" /> "Mine" untuk menambah kartu.</p>
            </section>
          )
        }
        <CardsOptionDialog isOpen={isSettingOpen} searchParams={searchParams} handleDialogClose={handleSettingClose} />
        <Outlet />
        {location.state && <Toast message={location.state.message} />}
      </main>
    </>
  )
}