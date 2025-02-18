export default function CardsCounter({newTotal = 0, learnTotal = 0, reviewTotal = 0}) {
  return (
    <section className="w-full md:max-w-sm md:max-h-[35rem] flex justify-around items-center gap-2 font-extrabold text-xs text-center">
      <p className="p-2 flex-1 text-green-400 bg-white rounded-lg border">{newTotal}</p>
      <p className="p-2 flex-1 text-red-400 bg-white rounded-lg border">{learnTotal}</p>
      <p className="p-2 flex-1 text-amber-400 bg-white rounded-lg border">{reviewTotal}</p>
    </section>
  );
}
