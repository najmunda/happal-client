import {
  Form,
  redirect,
  useLoaderData,
  useNavigation,
  useRouteLoaderData,
} from "react-router-dom";
import { CloudAlert, LogOut, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import {
  deleteAllCardDoc,
  downloadAllCardDoc,
  importCardDocs,
  syncDB,
  setAuthedUserDoc,
  uploadLog,
  getCardDocTotal,
} from "../db";
import AccountButtons from "../components/AccountButtons";
import Toast from "../components/Toast";
import { OnlineContext } from "../routes/root/root";
import { useContext } from "react";
import clsx from "clsx";
import { safeFetch } from "../utils/utils";

export async function loader() {
  const { payload: cardDocsTotal } = await getCardDocTotal();
  return {
    cardDocsTotal, // All cards total (nothing excluded)
  };
}

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  try {
    let response;
    switch (intent) {
      case "sync": {
        response = await syncDB();
        break;
      }
      case "delete": {
        response = await deleteAllCardDoc();
        break;
      }
      case "download": {
        response = await downloadAllCardDoc();
        break;
      }
      case "import": {
        response = await importCardDocs(formData.get("file"));
        break;
      }
      case "upload-log": {
        response = await uploadLog();
        break;
      }
      case "logout": {
        let deleted = false;
        if (navigator.onLine) {
          response = await safeFetch(
            `${import.meta.env.VITE_SERVER_URL}/user/logout`,
            { method: "POST", credentials: "include" },
          );
          if (response.ok) {
            await setAuthedUserDoc({ _deleted: true });
            deleted = true;
          }
        }
        if (deleted === false) {
          await setAuthedUserDoc({ pending_logout: true });
        }
        return redirect("/account");
      }
      default: {
        break;
      }
    }
    if (response?.message) {
      toast.custom(() => (
        <Toast
          message={response.message}
          color={response.success ? "green" : "red"}
        />
      ));
    }
    return null;
  } catch (error) {
    toast.custom(() => <Toast message={error.message} color="red" />);
    return null;
  }
}

export default function Account() {
  const { cardDocsTotal } = useLoaderData();
  const isOnline = useContext(OnlineContext);
  const { authedUserDoc, avatarBlob } = useRouteLoaderData("root");
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  return (
    <main
      className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}
    >
      <div className="w-full max-w-sm flex-[1_1_auto] [@media(min-height:600px)]:flex-[0_1_auto] h-[100px] [@media(min-height:600px)]:h-fit md:max-h-[35rem] p-6 flex flex-col items-stretch gap-3 bg-white text-center rounded-lg shadow overflow-y-auto">
        {isLoading ? (
          <Loading className="flex-1 flex flex-col justify-center items-center" />
        ) : Object.hasOwn(authedUserDoc, "id") ? (
          <>
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <img
                src={URL.createObjectURL(avatarBlob)}
                className="size-20 rounded-full self-center"
                alt=""
              />
              <div className="flex flex-col gap-2 justify-center overflow-hidden">
                <p className="text-2xl text-center sm:text-left truncate">
                  {authedUserDoc.username}
                </p>
                <p className="text-xs text-center sm:text-left text-wrap">
                  {authedUserDoc["last_sync"]
                    ? `Sinkron Terakhir: ${new Date(authedUserDoc["last_sync"]).toLocaleString()}`
                    : "Kartu anda belum disinkronkan."}
                </p>
              </div>
            </div>
            <Form method="post" className="flex flex-col divide-y-2">
              <p className="p-2 text-left text-neutral-400 text-sm">
                Sinkronisasi Awan
              </p>
              <button
                type="submit"
                name="intent"
                value="sync"
                className={clsx("p-2 flex gap-2 items-center text-left", {
                  "text-black hover:bg-neutral-100": isOnline === true,
                  "text-neutral-400": isOnline === false,
                })}
                disabled={isOnline === false}
              >
                <RefreshCw />
                Sinkronkan kartu
              </button>
              <AccountButtons cardDocsTotal={cardDocsTotal} />
              <p className="p-2 text-left text-neutral-400 text-sm">Akun</p>
              <button
                type="submit"
                name="intent"
                value="upload-log"
                className={clsx("p-2 flex gap-2 items-center text-left", {
                  "text-black hover:bg-neutral-100 cursor-pointer":
                    isOnline === true,
                  "text-neutral-400 cursor-default": isOnline === false,
                })}
              >
                <CloudAlert />
                Unggah log eror
              </button>
              <button
                type="submit"
                name="intent"
                value="logout"
                className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"
              >
                <LogOut />
                Keluar
              </button>
            </Form>
          </>
        ) : (
          <>
            <img src="/happal.svg" alt="" className="size-20 self-center" />
            <p className="text-center text-xl">
              Sinkronkan, Gunakan dimanapun.
            </p>
            <p className="text-center text-sm">
              Buat/Login akun untuk menyimpan kartu dan menghafal dimanapun.
            </p>
            <div className="flex gap-2 justify-center">
              <a
                href={`${import.meta.env.VITE_SERVER_URL}/user/login/google`}
                className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-100"
              >
                <img src="/google_g_icon.png" alt="" className="size-8" />
              </a>
            </div>
            <Form method="post" className="flex flex-col border-t-2 divide-y-2">
              <AccountButtons cardDocsTotal={cardDocsTotal} />
            </Form>
          </>
        )}
      </div>
    </main>
  );
}
