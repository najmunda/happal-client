import { Outlet, useLocation, useNavigation } from "react-router-dom"
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Loading from "../../components/Loading";
import { getFirstPath } from "../../utils";
import { Toaster } from "react-hot-toast";

export async function loader() {
  const serverStatusResponse = await fetch('/api/server/status');
  let authedUser = null;
  let avatarBlob = null;
  if (serverStatusResponse.ok) {
    const loggedUserResponse = await fetch('/api/user/me');
    if (loggedUserResponse.ok) {
      authedUser = await loggedUserResponse.json();
      const avatarResponse = await fetch(`https://ui-avatars.com/api/?name=${authedUser.username}`);
      avatarBlob = await avatarResponse.blob();
    }
  }
  return { serverStatus: serverStatusResponse.status.toString(), authedUser, avatarBlob };
}

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