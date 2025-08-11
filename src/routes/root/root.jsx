import {
  Outlet,
  useFetcher,
  useLocation,
  useNavigation,
} from "react-router-dom";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";
import Loading from "../../components/Loading";
import { getFirstPath, safeFetch } from "../../utils/utils";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { createContext } from "react";
import { getAuthedUserDoc, setAuthedUserDoc } from "../../db";

export const OnlineContext = createContext(navigator.onLine);

export async function loader() {
  let { payload: authedUserDoc } = await getAuthedUserDoc();
  let avatarBlob = authedUserDoc["avatar_blob"];
  if (navigator.onLine) {
    const serverStatusResponse = await safeFetch(
      "http://localhost:3000/server/status",
    );
    if (serverStatusResponse.ok) {
      if (Object.hasOwn(authedUserDoc, "pending_logout")) {
        const logoutResponse = await safeFetch("/api/user/logout", {
          method: "POST",
        });
        if (logoutResponse.ok) {
          await setAuthedUserDoc({ _deleted: true });
          authedUserDoc = { _id: "authed-user" };
          avatarBlob = undefined;
        }
      } else {
        const loggedUserResponse = await safeFetch("/api/user/me");
        if (loggedUserResponse.ok) {
          ({
            data: { userDetail: authedUserDoc },
          } = await loggedUserResponse.json());
          const avatarResponse = await safeFetch(
            `https://ui-avatars.com/api/?name=${authedUserDoc.username}`,
          );
          avatarBlob = await avatarResponse.blob();
          await setAuthedUserDoc({ ...authedUserDoc, avatar_blob: avatarBlob });
        } else if (Object.hasOwn(authedUserDoc, "id")) {
          await setAuthedUserDoc({ _deleted: true });
          authedUserDoc = { _id: "authed-user" };
          avatarBlob = undefined;
        }
      }
    }
  }
  return {
    // serverStatus: serverStatusResponse.status.toString(),
    authedUserDoc,
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
