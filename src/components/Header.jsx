import { BookType } from "lucide-react";
import Navigation from "./Navigation";
import { Link } from "react-router-dom";


export default function Header() {
  return (
    <header className="h-14 sticky top-0 px-4 py-2 border border-b flex items-center justify-between bg-white">
      <div className="flex gap-1">
        <BookType />
        <p>Sorbit</p>
      </div>
      <nav className="hidden md:block md:flex-1">
        <Navigation />
      </nav>
      <Link to={"/account"} className="h-full">
        <img src="/profile.png" alt="" className="h-full rounded-full" />
      </Link>
    </header>
  );
}
