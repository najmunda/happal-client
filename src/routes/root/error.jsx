import { CircleX } from "lucide-react";
import { useRouteError } from "react-router-dom";
import { logError } from "../../utils/logger";
import { useEffect, useRef } from "react";
import RootLayout from "./components/RootLayout";

export default function RootError() {
  const error = useRouteError();
  const isErrorLoggedRef = useRef(false);

  console.error(error);

  useEffect(() => {
    if (isErrorLoggedRef.current === false) {
      const asyncLogError = async (error) => {
        await logError(error);
      };
      asyncLogError(error);
      isErrorLoggedRef.current = true;
    }
  }, []);

  return (
    <RootLayout>
      <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
        <section className="p-2 flex-1 flex flex-col gap-2 justify-center items-center text-content-secondary dark:text-content-secondary-dark">
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
    </RootLayout>
  );
}
