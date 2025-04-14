import { Form, redirect, useNavigation, useRouteLoaderData } from "react-router-dom"
import { LogOut, RefreshCw } from "lucide-react";
import { ServerCrash } from "lucide-react";
import Loading from "../components/Loading";

export async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  console.log("intent:", intent);
  if (intent === "logout") {
    const response = await fetch("/api/user/logout", {method: 'POST',});
    console.log(response);
    if (response.ok) {
      return redirect('/account');
    }
  }
}

export default function Account() {
  const { responseStatus, authedUser, avatarBlob } = useRouteLoaderData('root');
  console.log(authedUser);
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading" || navigation.state === "submitting";
  return (
    <main className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}>
      {
        responseStatus.match(/^5/g) ? 
        <section className="p-2 flex-1 flex flex-col justify-center items-center text-neutral-500">
          <ServerCrash size={80} />
          <p className="text-center text-sm">Terjadi galat pada server.</p>
          <p className="text-center text-sm">Muat ulang halaman dan coba lagi. Atau <a href="https://x.com/najmunda" className="font-bold">Hubungi Pengembang</a>.</p>
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
                    <p className="text-sm text-left">Sinkron Terakhir: {authedUser['last_sync']}</p>
                  </div>
                </div>
                <Form method="post" className="flex flex-col divide-y-2">
                  <button type="submit" name="intent" value="sync" className="py-2 flex gap-2 items-center hover:bg-neutral-100"><RefreshCw />Sinkronkan Kartu</button>
                  <button type="submit" name="intent" value="logout" className="py-2 flex gap-2 items-center hover:bg-neutral-100"><LogOut />Keluar</button>
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
              </>
            )
          }
        </div>
      }
    </main>
  )
}