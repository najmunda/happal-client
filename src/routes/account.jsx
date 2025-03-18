import { Hammer } from "lucide-react";

export default function Account() {
  return (
    <main className="container w-dvw md:w-full flex-1 p-2 flex flex-col gap-2">
      <section className="p-2 flex-1 flex flex-col justify-center items-center text-neutral-500">
        <Hammer size={80} />
        <p className="text-center text-sm">Fitur akun & sinkronisasi masih dalam pengembangan.</p>
        <p className="text-center text-sm">Terima kasih atas antusiasme anda.</p>
      </section>
    </main>
  )
}