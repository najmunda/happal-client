import { Form, redirect, useNavigation, useRouteLoaderData } from "react-router-dom"
import { LogOut, RefreshCw } from "lucide-react";
import { ServerCrash } from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { deleteAllCards, downloadAllCards, importCards, syncDB } from "../db";
import AccountButtons from "../components/AccountButtons";
import Toast from "../components/Toast";

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "sync": {
      try {
        const response = await syncDB();
        toast.custom((t) => (<Toast message="Kartu berhasil disinkronisasi." color="green" />));
        return response;
      } catch (error) {
        toast.custom((t) => (<Toast message="Terjadi galat saat sinkronisasi. Ulangi." color="red" />));
        return null;
      }
    }
    case "delete": {
      await deleteAllCards();
      return null;
    }
    case "download": {
      await downloadAllCards();
      return null;
    }
    case "import": {
      try {
        const importedFileObjUrl = formData.get("file");
        await importCards(importedFileObjUrl);
        toast.custom((t) => (<Toast message="Kartu berhasil diimpor." color="green" />));
        return null;
      } catch (error) {
        toast.custom((t) => (<Toast message={error.message} color="red" />));
        return null;
      }
    }
    case "logout": {
      const response = await fetch("/api/user/logout", {method: 'POST',});
      if (response.ok) {
        return redirect('/account');
      }
      return null;
    }
    default: {
      return null;
    }
  }
}

export default function Account() {
  const { serverStatus, authedUser, avatarBlob } = useRouteLoaderData('root');
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";
  return (
    <main className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}>
      <div
        className="w-full max-w-sm flex-[1_1_auto] [@media(min-height:600px)]:flex-[0_1_auto] h-[100px] [@media(min-height:600px)]:h-fit md:max-h-[35rem] p-6 flex flex-col items-stretch gap-3 bg-white text-center rounded-lg shadow overflow-y-auto"
      > 
        {isLoading ? 
          <Loading className='flex-1 flex flex-col justify-center items-center' />
          : authedUser ? (
            <>
              <div className="flex flex-col sm:flex-row items-stretch gap-2">
                <img src={URL.createObjectURL(avatarBlob)} className="size-20 rounded-full self-center" alt="" />
                <div className="flex flex-col gap-2 justify-center overflow-hidden">
                  <p className="text-2xl text-center sm:text-left truncate">{authedUser.username}</p>
                  <p className="text-xs text-center sm:text-left text-wrap">
                    {authedUser['last_sync'] ? (
                      `Sinkron Terakhir: ${(new Date(authedUser['last_sync'])).toLocaleString()}`
                    ) : (
                      'Kartu anda belum disinkronkan.'
                    )}
                  </p>
                </div>
              </div>
              <Form method="post" className="flex flex-col divide-y-2">
                <button type="submit" name="intent" value="sync" className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"><RefreshCw />Sinkronkan kartu</button>
                <AccountButtons />
                <button type="submit" name="intent" value="logout" className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"><LogOut />Keluar</button>
              </Form>
            </>
          ) : (
            <>
              {
                serverStatus.match(/^5/g) ? (
                  <>
                    <ServerCrash size={80} className="self-center shrink-0" />
                    <p className="text-center text-xl">Autentikasi tidak tersedia.</p>
                    <p className="text-center text-sm">Anda tidak terkoneksi internet / terjadi galat pada server. Cek koneksi internet anda, muat ulang halaman dan coba lagi. Atau <a href="https://x.com/najmunda" className="font-bold">Hubungi Pengembang</a>.</p>
                  </>
                ) : (
                  <>
                    <img src="/happal.svg" alt="" className="size-20 self-center" />
                    <p className="text-center text-xl">Sinkronkan, Gunakan dimanapun.</p>
                    <p className="text-center text-sm">Buat/Login akun untuk menyimpan kartu dan menghafal dimanapun.</p>
                    <div className="flex gap-2 justify-center">
                      <a href="/api/user/login/google" className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-100"><img src="/google_g_icon.png" alt="" className="size-8" /></a>
                    </div>
                  </>
                )
              }
              <Form method="post" className="flex flex-col border-t-2 divide-y-2">
                <AccountButtons />
              </Form>
            </>
          )
        }
      </div>
    </main>
  )
}