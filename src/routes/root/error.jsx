import { CircleX } from "lucide-react";
import { useRouteError } from "react-router-dom";
import { logError } from "../../utils/logger";
import Header from "../../components/Header";
import Navigation from "../../components/Navigation";

export default function RootError() {
  const error = useRouteError();
  if (Object.hasOwn(error, "cause") === false) {
    logError(error);
  }
  return (
    <>
      <Header />
      <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
        <section className="p-2 flex-1 flex flex-col gap-2 justify-center items-center text-neutral-400">
          <CircleX size={80} />
          <p className="text-center text-sm">
            {error?.cause
              ? `Terjadi eror. ${error.message}.`
              : "Terjadi eror yang tidak terduga."}
          </p>
          <p className="text-center text-sm">
            Muat ulang halaman dan coba lagi. Atau{" "}
            <a href="https://x.com/najmunda" className="font-bold">
              Hubungi Pengembang
            </a>
          </p>
        </section>
      </main>
      <footer className="px-4 py-2 w-dvw md:w-full order-last flex md:hidden sticky bg-white rounded-t-lg bottom-0 shadow">
        <nav className="flex-1 md:hidden">
          <Navigation />
        </nav>
      </footer>
    </>
  );
}
