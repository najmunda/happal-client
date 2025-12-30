import { Link, useLocation } from "react-router-dom";
import { HelpCircle, Moon, Settings, Sun } from "lucide-react";
import Navigation from "./Navigation";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Card from "../../../components/Card";

export default function Header({ isDarkTheme, handleDarkToggle }) {
  const location = useLocation();
  const currentPathNQuery = location.pathname + location.search;
  return (
    <Card
      as="header"
      className="h-14 w-dvw flex justify-center z-10 rounded-none rounded-b-lg"
    >
      <div className="h-full container w-full px-4 py-2 flex items-center justify-between relative">
        <Link to={"/"} className="flex items-center gap-2 cursor-help">
          <img src="/happal.svg" alt="" />
          <p className="text-xl">Happal</p>
        </Link>
        <nav className="hidden md:block md:absolute md:left-1/2 md:-translate-x-1/2">
          <Navigation />
        </nav>
        <div className="flex items-center justify-end gap-1 md:gap-2">
          {!["/", "/settings"].includes(location.pathname) && (
            <Link
              className={`p-2 hover:bg-main hover:text-content ${location.pathname.includes("help") ? "bg-main text-content" : ""} rounded-full`}
              to={location.pathname + "/help"}
              state={{ prevPathNQuery: currentPathNQuery }}
            >
              <HelpCircle />
            </Link>
          )}
          <button
            className="p-2 hover:bg-main hover:text-content rounded-full cursor-pointer"
            onClick={handleDarkToggle}
          >
            {isDarkTheme ? <Sun /> : <Moon />}
          </button>
          <Link
            to={"/settings"}
            className={`p-2 hover:bg-main hover:text-content ${location.pathname.includes("account") ? "bg-main text-content" : ""} rounded-full`}
          >
            <Settings />
          </Link>
          <a
            className="p-2 hover:bg-main hover:text-content rounded-full"
            href="https://github.com/najmunda/happal-client"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub />
          </a>
        </div>
      </div>
    </Card>
  );
}
