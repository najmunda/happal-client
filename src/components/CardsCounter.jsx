export default function CardsCounter({newTotal = 0, learnTotal = 0, reviewTotal = 0}) {
  return (
    <section className="w-full md:max-w-sm md:max-h-[35rem] flex justify-around items-center gap-2 font-extrabold text-xs text-center">
      <p className="p-2 flex-1 font-extrabold bg-green-400 rounded-lg border border-[var(--line-color)]">{newTotal}</p>
      <p className="p-2 flex-1 font-extrabold bg-red-400 rounded-lg border border-[var(--line-color)]">{learnTotal}</p>
      <p className="p-2 flex-1 font-extrabold bg-amber-400 rounded-lg border border-[var(--line-color)]">{reviewTotal}</p>
    </section>
  );
}
