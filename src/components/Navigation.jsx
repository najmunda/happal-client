import { NavLink } from "react-router-dom";
import { Inbox, LayoutDashboard, Pickaxe, Repeat } from "lucide-react"

export function NavButton({to, Icon, label}) {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({isActive}) => `p-2 flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg hover:bg-neutral-100 ${isActive ? "border border-black bg-green-100" : ""}`}
      >
        {Icon}
        <p className="text-sm">{label}</p>
      </NavLink>
    </li>
  );
}

export default function Navigation() {
  return (
    <ul className="flex justify-around md:justify-center gap-2 md:gap-10 bg-white font-extralight items-center">
      {/* <NavButton to={"/"} Icon={<LayoutDashboard />} label={'Home'} /> */}
      <NavButton to={"/mine"} Icon={<Pickaxe />} label={'Mine'} />
      <NavButton to={"/sorb"} Icon={<Repeat />} label={'Sorb'} />
      <NavButton to={"/cards"} Icon={<Inbox />} label={'Cards'} />
    </ul>
  );
}
