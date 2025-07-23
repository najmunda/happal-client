import {
  Outlet,
  useFetcher,
  useLocation,
  useNavigation,
} from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Loading from "../../components/Loading";
import { getFirstPath } from "../../utils/utils";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { getAuthedUserDoc, updateAuthedUserDoc } from "../../db";

export const OnlineContext = createContext(navigator.onLine);

export async function loader() {
  let { payload: authedUser } = await getAuthedUserDoc();
  let avatarBlob = authedUser["avatar_blob"];
  if (navigator.onLine) {
    const serverStatusResponse = await fetch("/api/server/status");
    if (serverStatusResponse.ok) {
      if (Object.hasOwn(authedUser, "pending_logout")) {
        const logoutResponse = await fetch("/api/user/logout", {
          method: "POST",
        });
        if (logoutResponse.ok) {
          await updateAuthedUserDoc({ _deleted: true });
          authedUser = { _id: "authed-user" };
          avatarBlob = undefined;
        }
      } else {
        const loggedUserResponse = await fetch("/api/user/me");
        if (loggedUserResponse.ok) {
          ({
            data: { userDetail: authedUser },
          } = await loggedUserResponse.json());
          const avatarResponse = await fetch(
            `https://ui-avatars.com/api/?name=${authedUser.username}`,
          );
          avatarBlob = await avatarResponse.blob();
          await updateAuthedUserDoc({ ...authedUser, avatar_blob: avatarBlob });
        } else if (Object.hasOwn(authedUser, "id")) {
          await updateAuthedUserDoc({ _deleted: true });
          authedUser = { _id: "authed-user" };
          avatarBlob = undefined;
        }
      }
    }
  }
  return {
    // serverStatus: serverStatusResponse.status.toString(),
    authedUser,
    avatarBlob,
  };
}

export default function Root() {
  const navigation = useNavigation();
  const location = useLocation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const fetcher = useFetcher();

  const isPageChange =
    getFirstPath(location.pathname) !=
      getFirstPath(navigation.location?.pathname) &&
    navigation.state === "loading";

  useEffect(() => {
    const checkLineHandler = () => {
      setIsOnline(navigator.onLine);
      fetcher.load("/");
    };
    addEventListener("online", checkLineHandler);
    addEventListener("offline", checkLineHandler);
    return () => {
      removeEventListener("online", checkLineHandler);
      removeEventListener("offline", checkLineHandler);
    };
  }, []);

  return (
    <OnlineContext.Provider value={isOnline}>
      <Header />
      {isPageChange ? (
        <Loading className="flex-1 flex flex-col justify-center items-center" />
      ) : (
        <Outlet />
      )}
      <footer className="px-4 py-2 w-dvw md:w-full order-last flex md:hidden sticky bg-white rounded-t-lg bottom-0 shadow">
        <nav className="flex-1 md:hidden">
          <Navigation />
        </nav>
      </footer>
      <div>
        <Toaster position="bottom-center" reverseOrder={false} />
      </div>
    </OnlineContext.Provider>
  );
}
