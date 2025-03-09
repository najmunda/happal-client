import { BookType, CircleUser } from "lucide-react";
import Navigation from "./Navigation";
import { NavLink } from "react-router-dom";


export default function Header() {
  return (
    <header className="h-14 sticky top-0 w-full bg-white flex justify-center z-10">
      <div className="h-full container w-dvw md:w-full sticky top-0 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <BookType size={28} />
          <p className="text-xl">Happal</p>
        </div>
        <nav className="hidden md:block md:flex-1">
          <Navigation />
        </nav>
        <NavLink 
          to={"/account"} 
          className={({isActive}) => `p-2 rounded-full hover:bg-neutral-100 ${isActive ? "border border-black bg-green-100" : ""}`}>
          <CircleUser />
        </NavLink>
      </div>
    </header>
  );
}
