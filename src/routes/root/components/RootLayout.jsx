import {
  useLocation,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { getFirstPath } from "../../../utils/utils";
import Header from "./Header";
import Loading from "../../../components/Loading";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function RootLayout({ children }) {
  const initialIsDarkTheme = useRouteLoaderData("root");
  const [isDarkTheme, setIsDarkTheme] = useState(initialIsDarkTheme);

  function handleDarkToggle() {
    setIsDarkTheme((prevState) => {
      const newState = !prevState;
      localStorage.setItem("happal-dark", JSON.stringify(newState));
      if (newState) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      return newState;
    });
  }

  const navigation = useNavigation();
  const location = useLocation();

  const isPageChange =
    getFirstPath(location.pathname) !=
      getFirstPath(navigation.location?.pathname) &&
    navigation.state === "loading";

  return (
    <>
      <Header isDarkTheme={isDarkTheme} handleDarkToggle={handleDarkToggle} />
      {isPageChange ? (
        <Loading className="flex-1 flex flex-col justify-center items-center" />
      ) : (
        <>{children}</>
      )}
      <Footer />
      {createPortal(
        <>
          {window.screen.width >
          40 *
            parseFloat(getComputedStyle(document.documentElement).fontSize) ? (
            <Toaster position="bottom-center" reverseOrder={false} />
          ) : (
            <Toaster position="top-center" reverseOrder={false} />
          )}
        </>,
        document.body,
      )}
    </>
  );
}
