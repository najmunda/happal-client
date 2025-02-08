import { Form, Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import { CopyX, Info, Pickaxe, SearchX, SquarePen, Trash2 } from "lucide-react";
import { getCardsCustom, getCardsTotal } from "../../db";
import Header from "../../components/Header";
import CardsSettings from "../../components/CardsSettings";
import Toast from "../../components/Toast";

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

  console.log(cards);

  return (
    <>
      <Header/>
      <main className='flex-1 p-2 flex flex-col gap-2'>
        {cardsTotal != 0 ? <CardsSettings searchParams={searchParams} /> : <></>}
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
        <Outlet />
        {location.state && <Toast message={location.state.message} />}
      </main>
    </>
  )
}