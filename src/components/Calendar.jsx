import { getMonth } from "../utils";

export default function Calendar() {
  const todayDate = new Date();
  const startMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
  const endMonthDate = new Date(todayDate.getFullYear(), todayDate.getMonth() + 1, 0);
  const dates = new Array(endMonthDate.getDate()).fill('A');
  return (
    <section className="p-2 flex flex-col items-stretch gap-2 bg-white text-center rounded-lg border border-black">
      <h1 className="text-lg">{getMonth(todayDate.getMonth())}</h1>
      <div className="grid grid-cols-7 gap-2">
        <p>M</p><p>S</p><p>S</p><p>R</p><p>K</p><p>J</p><p>S</p>
        <div className={`bg-neutral-200 rounded-full col-span-${startMonthDate.getDay()}`}>
          <p className="text-neutral-200">_</p>
        </div>
        {dates.map((date, index) => <p>{index + 1}</p>)}
      </div>
    </section>
  );
}
