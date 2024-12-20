import { Outlet } from "react-router-dom"
import Navigation from "../components/Navigation";

/*
export const action = (logout) => async function ({ request }) {
  return logout();
}
  */

export default function Root() {
  return (
    <>
      <Navigation />
      <main className="px-10 py-2 flex flex-col gap-3">
        <Outlet />
      </main>
    </>
  );
}