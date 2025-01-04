import { Link } from "react-router-dom";
import { Inbox, LayoutDashboard, Pickaxe, Repeat } from "lucide-react"

export default function Navigation() {

  return (
    <nav className="w-full sticky bottom-0 px-4 py-2 border border-t bg-white">
      <ul className="flex justify-around text-[0.75rem] font-extralight items-center">
        <li>
          <Link to={"/"} className="flex flex-col items-center gap-1"><LayoutDashboard size={16} />Home</Link>
        </li>
        <li>
          <Link to={"/mine"} className="flex flex-col items-center gap-1"><Pickaxe size={16} />Mine</Link>
        </li>
        <li>
          <Link to={"/sorb"} className="flex flex-col items-center gap-1"><Repeat size={16} />Sorb</Link>
        </li>
        <li>
          <Link to={"/cards"} className="flex flex-col items-center gap-1"><Inbox size={16} />Cards</Link>
        </li>
      </ul>
    </nav>
  );
}
