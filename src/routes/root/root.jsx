import { Outlet } from "react-router-dom";
import RootLayout from "./components/RootLayout";

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
  return (
    <RootLayout>
      <Outlet />
    </RootLayout>
  );
}
