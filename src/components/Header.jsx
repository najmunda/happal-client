import { Link, useLocation } from "react-router-dom";
import { HelpCircle, Moon, Sun } from "lucide-react";
import Navigation from "./Navigation";
import { SiGithub } from "@icons-pack/react-simple-icons";

export default function Header({isDarkTheme, handleDarkToggle}) {
  const location = useLocation();
  return (
    <header className="h-14 w-dvw bg-white dark:bg-neutral-700 flex justify-center z-10 rounded-lg shadow-sm">
      <div className="h-full container w-full px-4 py-2 flex items-center justify-between relative">
        <Link to={"/"} className="flex items-center gap-2 cursor-help">
          <img src="/happal.svg" alt="" />
          <p className="text-xl">Happal</p>
        </Link>
        <nav className="hidden md:block md:absolute md:left-1/2 md:-translate-x-1/2">
          <Navigation />
        </nav>
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <button
            className="p-2 hover:bg-green-300 rounded-full"
            onClick={handleDarkToggle}
          >
            {
              isDarkTheme ? <Sun /> : <Moon />
            }
          </button>
          {location.pathname !== "/" && (
            <Link
              className="p-2 hover:bg-green-300 rounded-full"
              to={location.pathname + "/help"}
            >
              <HelpCircle />
            </Link>
          )}
          <a
            className="p-2 hover:bg-green-300 rounded-full"
            href="https://github.com/najmunda/happal-client"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub />
          </a>
        </div>
      </div>
    </header>
  );
}
