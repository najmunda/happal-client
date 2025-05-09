import { Form, redirect, useNavigation, useRouteLoaderData } from "react-router-dom"
import { Download, LogOut, Trash2 } from "lucide-react";
import { ServerCrash } from "lucide-react";
import Loading from "../components/Loading";
import { downloadAllCards } from "../db";

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "download": {
      await downloadAllCards();
      return null;
    }
    case "logout": {
      const response = await fetch("/api/user/logout", {method: 'POST',});
      if (response.ok) {
        return redirect('/account');
      }
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
      {
        serverStatus.match(/^5/g) ? 
        <section className="p-2 flex-1 flex flex-col justify-center items-center gap-2 text-neutral-500">
          <ServerCrash size={80} />
          <p className="text-center text-sm">Anda tidak terkoneksi internet / terjadi galat pada server.</p>
          <p className="text-center text-sm">Cek koneksi internet anda, muat ulang halaman dan coba lagi. Atau <a href="https://x.com/najmunda" className="font-bold">Hubungi Pengembang</a>.</p>
        </section>
        :
        <div
          className="w-full max-w-sm h-fit md:max-h-[35rem] p-6 flex flex-col items-stretch gap-3 bg-white text-center rounded-lg shadow overflow-y-auto"
        > 
          {isLoading ? 
            <Loading className='flex-1 flex flex-col justify-center items-center' />
            : authedUser ? (
              <>
                <div className="flex items-center gap-2">
                  <img src={URL.createObjectURL(avatarBlob)} className="rounded-full" alt="" />
                  <div className="flex flex-col gap-2 justify-center">
                    <p className="text-2xl text-left">{authedUser.username}</p>
                    <p className="text-xs text-left">
                      {authedUser['last_sync'] ? (
                        `Sinkron Terakhir: ${(new Date(authedUser['last_sync'])).toLocaleString()}`
                      ) : (
                        'Kartu anda belum disinkronkan.'
                      )}
                    </p>
                  </div>
                </div>
                <Form method="post" className="flex flex-col divide-y-2">
                  <button type="submit" name="intent" value="download" className="p-2 flex gap-2 items-center hover:bg-neutral-100"><Download />Unduh Kartu</button>
                  <button type="submit" name="intent" value="logout" className="p-2 flex gap-2 items-center hover:bg-neutral-100"><LogOut />Keluar</button>
                </Form>
              </>
            ) : (
              <>
                <img src="/happal.svg" alt="" className="size-20 self-center" />
                <p className="text-center text-xl">Sinkronkan, Gunakan dimanapun.</p>
                <p className="text-center text-sm">Buat/Login akun untuk menyimpan kartu dan menghafal dimanapun.</p>
                <div className="flex gap-2 justify-center">
                  <a href="/api/user/login/google" className="p-2 border border-neutral-200 rounded-full hover:bg-neutral-100"><img src="/google_g_icon.png" alt="" className="size-8" /></a>
                </div>
                <Form method="post" className="flex flex-col border-t-2 divide-y-2">
                  <button type="submit" name="intent" value="download" className="p-2 flex gap-2 items-center hover:bg-neutral-100"><Download />Unduh semua kartu</button>
                </Form>
              </>
            )
          }
        </div>
      }
    </main>
  )
}