import { NavLink } from "react-router-dom";
import { Inbox, Pickaxe, Repeat } from "lucide-react";

export function NavButton({ to, Icon, label }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `p-2 flex flex-col md:flex-row items-center gap-1 md:gap-3 rounded-lg hover:bg-main hover:text-content ${isActive ? "bg-main text-content" : ""}`
        }
      >
        {Icon}
        <p className="text-sm">{label}</p>
      </NavLink>
    </li>
  );
}

export default function Navigation() {
  return (
    <ul className="flex justify-around md:justify-center gap-2 md:gap-10 bg-card dark:bg-card-dark dark:text-content-dark font-extralight items-center">
      {/* <NavButton to={"/"} Icon={<LayoutDashboard />} label={'Home'} /> */}
      <NavButton to={"/mine"} Icon={<Pickaxe />} label={"Mine"} />
      <NavButton to={"/sorb"} Icon={<Repeat />} label={"Sorb"} />
      <NavButton to={"/cards"} Icon={<Inbox />} label={"Cards"} />
    </ul>
  );
}
