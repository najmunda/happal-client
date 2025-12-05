import { HelpCircle } from "lucide-react";
import { SiGithub, SiX } from "@icons-pack/react-simple-icons";
import Card from "../components/Card";

export function Component() {
  return (
    <main
      className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}
    >
      <Card
        as="div"
        className="w-full py-6 max-w-sm h-fit md:max-h-140 flex flex-col text-center justify-center items-center gap-3 overflow-y-auto"
      >
        <div className="flex items-center gap-2">
          <img src="/happal.svg" alt="" className="h-full" />
          <p className="text-6xl">Happal</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/najmunda/happal-client"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub />
          </a>
          <a
            href="https://x.com/najmunda"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiX />
          </a>
        </div>
        <p className="text-sm">
          Sebuah aplikasi web sederhana untuk menghafal kata/frasa menggunakan
          Spaced Repetition System (SRS).
        </p>
        <p className="text-sm">
          Klik/Tap tombol &#34;
          <HelpCircle className="inline" />
          &#34; di pojok kanan atas untuk mengetahui cara menggunakan aplikasi.
        </p>
        <p className="text-sm">
          Aplikasi ini masih dalam pengembangan, dan mungkin anda akan menemukan
          error. Saya akan sangat senang jika anda memberitahu pengalaman/error
          yang anda temukan.
        </p>
        <p className="text-sm">
          Terima kasih sudah bersedia menggunakan aplikasi ini!
        </p>
      </Card>
    </main>
  );
}

Component.displayName = "AboutRoute";
