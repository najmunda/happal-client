import {
  Link,
  NavLink,
  useLocation,
  useRouteLoaderData,
} from "react-router-dom";
import { CircleUser, HelpCircle } from "lucide-react";
import Navigation from "./Navigation";
import SyncButton from "./SyncButton";

export default function Header() {
  const { authedUserDoc, avatarBlob } = useRouteLoaderData("root");
  const location = useLocation();
  return (
    <header className="h-14 w-dvw bg-white flex justify-center z-10 rounded-lg shadow">
      <div className="h-full container w-full px-4 py-2 flex items-center justify-between">
        <Link to={"/"} className="flex items-center gap-2 cursor-help">
          <img src="/happal.svg" alt="" />
          <p className="text-xl">Happal</p>
        </Link>
        <nav className="hidden md:block md:flex-1">
          <Navigation />
        </nav>
        <div className="flex items-center justify-end gap-1 md:gap-2">
          <Link
            className="p-2 hover:bg-green-300 rounded-full"
            to={location.pathname + "/help"}
          >
            <HelpCircle />
          </Link>
          {Object.hasOwn(authedUserDoc, "username") && <SyncButton />}
          <NavLink
            to={"/account"}
            className={({ isActive }) =>
              `${avatarBlob ? "" : "p-2 hover:bg-green-300"} rounded-full ${isActive ? "bg-green-300" : ""}`
            }
          >
            {avatarBlob ? (
              <img
                src={URL.createObjectURL(avatarBlob)}
                className="size-10 rounded-full"
                alt=""
              />
            ) : (
              <CircleUser />
            )}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
