import { CircleX } from "lucide-react";
import { useRouteError } from "react-router-dom";

export default function RootError() {
  const error = useRouteError();
  console.log(error);

  return (
    <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
      <section className="p-2 flex-1 flex flex-col gap-2 justify-center items-center text-neutral-400">
        <CircleX size={80} />
        <p className="text-center text-sm">Terjadi Kesalahan. Muat ulang halaman dan coba lagi. Atau <a href="https://x.com/najmunda" className="font-bold">Hubungi Pengembang</a></p>
      </section>
    </main>
  )
}