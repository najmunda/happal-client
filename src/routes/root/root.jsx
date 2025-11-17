import { Outlet, useLoaderData, useLocation, useNavigation } from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Loading from "../../components/Loading";
import { getFirstPath } from "../../utils/utils";
import { Toaster } from "react-hot-toast";
import { createContext, useState } from "react";

/*
export const action = (logout) => async function ({ request }) {
  return logout();
}
  */

export function loader() {
  const isDarkTheme = JSON.parse(localStorage.getItem("happal-dark"));
  if (isDarkTheme) document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  return isDarkTheme;
}

export default function Root() {
  const initialIsDarkTheme = useLoaderData();
  const navigation = useNavigation();
  const location = useLocation();
  const [ isDarkTheme, setIsDarkTheme ] = useState(initialIsDarkTheme);
  const isPageChange =
    getFirstPath(location.pathname) !=
      getFirstPath(navigation.location?.pathname) &&
    navigation.state === "loading";

  function handleDarkToggle() {
    setIsDarkTheme(prevState => {
      const newState = !prevState;
      localStorage.setItem("happal-dark", JSON.stringify(newState));
      if (newState) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return newState;
    });
  }

  return (
    <>
      <Header isDarkTheme={isDarkTheme} handleDarkToggle={handleDarkToggle} />
      {isPageChange ? (
        <Loading className="flex-1 flex flex-col justify-center items-center" />
      ) : (
        <Outlet />
      )}
      <footer className="px-4 py-2 w-dvw md:w-full order-last flex md:hidden bg-white rounded-t-lg shadow">
        <nav className="flex-1 md:hidden">
          <Navigation />
        </nav>
      </footer>
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </>
  );
}
