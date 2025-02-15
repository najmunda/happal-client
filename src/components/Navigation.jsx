import { Link } from "react-router-dom";
import { Inbox, LayoutDashboard, Pickaxe, Repeat } from "lucide-react"

function NavButton({to, Icon, label}) {
  return (
    <li>
      <Link to={to} className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
        {Icon}
        <p className="text-sm">{label}</p>
      </Link>
    </li>
  );
}

export default function Navigation() {
  return (
    <ul className="flex justify-around md:justify-center gap-2 md:gap-10 font-extralight items-center">
      <NavButton to={"/"} Icon={<LayoutDashboard />} label={'Home'} />
      <NavButton to={"/mine"} Icon={<Pickaxe />} label={'Mine'} />
      <NavButton to={"/sorb"} Icon={<Repeat />} label={'Sorb'} />
      <NavButton to={"/cards"} Icon={<Inbox />} label={'Cards'} />
    </ul>
  );
}
