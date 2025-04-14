import { CircleUser } from "lucide-react";
import Navigation from "./Navigation";
import { Link, NavLink, useRouteLoaderData } from "react-router-dom";


export default function Header() {
  const { avatarBlob } = useRouteLoaderData('root');
  return (
    <header className="h-14 sticky top-0 w-full bg-white flex justify-center z-10 rounded-lg shadow">
      <div className="h-full container w-dvw md:w-full sticky top-0 px-4 py-2 flex items-center justify-between">
        <Link to={"/"} className="flex items-center gap-2 cursor-help">
          <img src="/happal.svg" alt="" />
          <p className="text-xl">Happal</p>
        </Link>
        <nav className="hidden md:block md:flex-1">
          <Navigation />
        </nav>
        <NavLink 
          to={"/account"} 
          className={({isActive}) => `${avatarBlob ? "" : "p-2"} rounded-full hover:bg-green-300 ${isActive ? "bg-green-300" : ""}`}>
          {avatarBlob ? 
            <img src={URL.createObjectURL(avatarBlob)} className="size-10 rounded-full" alt="" /> 
            : 
            <CircleUser />}
        </NavLink>
      </div>
    </header>
  );
}
