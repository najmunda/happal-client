import { SiGithub, SiX } from "@icons-pack/react-simple-icons"

export default function About() {
  return (
    <main className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}>
      <div
        className="w-full flex-[1_1_auto] max-w-sm h-[100px] md:max-h-[35rem] py-6 px-2 flex flex-col items-center gap-3 bg-white text-center rounded-lg shadow overflow-y-auto"
      >
        <div className="flex items-center gap-2">
          <img src="/happal.svg" alt="" className="h-full" />
          <p className="text-6xl">Happal</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://github.com/najmunda/happal-client" target="_blank" rel="noopener noreferrer"><SiGithub /></a>
          <a href="https://x.com/najmunda" target="_blank" rel="noopener noreferrer"><SiX /></a>
        </div>
        <p className="text-sm">Sebuah aplikasi web sederhana untuk menghafal kata/frasa menggunakan Spaced Repetition System (SRS).</p>
        <p className="text-sm">Klik/Tap "Help" untuk mengetahui cara menggunakan aplikasi.</p>
        <p className="text-sm">Aplikasi ini masih dalam pengembangan, dan mungkin anda akan menemukan error. Saya akan sangat senang jika anda memberitahu pengalaman/error yang anda temukan.</p>
        <p className="text-sm">Terima kasih sudah bersedia menggunakan aplikasi ini!</p>
        <p className="text-sm">(Berkat paket-paket dibawah ini, terima kasih!) Aplikasi berhasil dibangun dengan:</p>
        <div className="flex justify-center items-center flex-wrap gap-2 text-xs">
          <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">react</a>
          <a href="https://github.com/open-spaced-repetition/ts-fsrs" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">ts-fsrs</a>
          <a href="https://pouchdb.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">pouchdb</a>
          <a href="https://reactrouter.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">react-router</a>
          <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">tailwindcss</a>
          <a href="https://vite.dev/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">vite</a>
          <a href="https://vite-pwa-org.netlify.app/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">vite-plugin-pwa</a>
          <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">lucide-react</a>
          <a href="https://www.fusejs.io/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">fusejs</a>
          <a href="https://react-hot-toast.com/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">react-hot-toast</a>
          <a href="https://interweave.dev/" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">interweave</a>
          <a href="https://github.com/icons-pack/react-simple-icons" target="_blank" rel="noopener noreferrer" className="px-2 py-1 border rounded-lg">react-simple-icons</a>
          <p>dan paket lainnya...</p>
        </div>
      </div>
    </main>
  )
}