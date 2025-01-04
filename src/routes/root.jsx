import { Outlet } from "react-router-dom"
import Header from "../components/Header";
import Navigation from "../components/Navigation";

/*
export const action = (logout) => async function ({ request }) {
  return logout();
}
  */

export default function Root() {
  return (
    <>
      <Outlet />
      <Navigation />
    </>
  );
}