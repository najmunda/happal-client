import { Outlet, useLocation, useNavigation } from "react-router-dom"
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Loading from "../../components/Loading";
import { getFirstPath } from "../../utils";
import { Toaster } from "react-hot-toast";

/*
export const action = (logout) => async function ({ request }) {
  return logout();
}
  */

export default function Root() {
  const navigation = useNavigation();
  const location = useLocation();
  
  const isPageChange = getFirstPath(location.pathname) != getFirstPath(navigation.location?.pathname) && navigation.state === "loading";

  return (
    <>
      <Header />
      {isPageChange ? 
        <Loading className='flex-1 flex flex-col justify-center items-center' /> 
      :
        <Outlet />
      }
      <footer className="px-4 py-2 w-dvw md:w-full order-last flex md:hidden sticky bg-white rounded-t-lg bottom-0 shadow">
        <nav className="flex-1 md:hidden">
          <Navigation />
        </nav>
      </footer>
      <div><Toaster position="bottom-center" reverseOrder={false} /></div>
    </>
  );
}