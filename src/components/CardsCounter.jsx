import { HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function CardsCounter({newTotal = 0, learnTotal = 0, reviewTotal = 0, handleDialogOpen}) {
  return (
    <section className="w-full md:max-w-sm md:max-h-[35rem] flex justify-around items-stretch gap-2 font-extrabold text-xs text-center">
      <p className="p-2 flex-1 font-extrabold bg-green-400 rounded-lg shadow">{newTotal}</p>
      <p className="p-2 flex-1 font-extrabold bg-red-400 rounded-lg shadow">{learnTotal}</p>
      <p className="p-2 flex-1 font-extrabold bg-amber-400 rounded-lg shadow">{reviewTotal}</p>
      <Link onClick={handleDialogOpen} className="py-2 px-4 flex gap-1 items-center rounded-lg bg-white shadow hover:shadow-md" to="help"><HelpCircle size={16} />Bantuan</Link>
    </section>
  );
}
