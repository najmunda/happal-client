import { useLoaderData } from "react-router-dom";
import { getCardsTotal, getMonthlyHistory, getTodayCards } from "../db";
import { getMonth, getStartTodayUTC, greetTime } from "../utils";
import Calendar from "../components/Calendar";

export async function loader() {
  const today = getStartTodayUTC();
  const monthlyHistory = await getMonthlyHistory();
  const newCards = monthlyHistory[today.getDate()]?.newCount ?? 0;
  const {cardsLeft} = await getTodayCards();
  const cardsToday = cardsLeft.new.length + cardsLeft.learn.length + cardsLeft.review.length;
  const cardsTotal = await getCardsTotal();
  return { newCards, cardsToday, cardsTotal };
}

export default function Home() {

  const { newCards, cardsToday, cardsTotal } = useLoaderData();

  return (
    <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
      <p className="font-bold text-3xl">Selamat {greetTime()}!</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        <section className="p-2 flex flex-col items-center bg-white text-center rounded-lg border border-black">
          <p className="text-7xl font-bold">{newCards}</p>
          <p className="text-sm">Kartu baru hari ini</p>
        </section>
        <section className="p-2 flex flex-col items-center bg-white text-center rounded-lg border border-black">
          <p className="text-7xl font-bold">{cardsToday}</p>
          <p className="text-sm">Kartu tersisa hari ini</p>
        </section>
        <section className="p-2 flex flex-col items-center bg-white text-center rounded-lg border border-black">
          <p className="text-7xl font-bold">{cardsTotal}</p>
          <p className="text-sm">Total kartu</p>
        </section>
      </div>
    </main>
  )
}