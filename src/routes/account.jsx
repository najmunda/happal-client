import { DatabaseBackup, Link, LogOut, UserRoundCog } from "lucide-react";

export default function Account() {
  return (
    <main className="flex-1 p-2 flex flex-col gap-2">
      <div
        className="w-full flex-1 p-2 flex flex-col items-stretch gap-2 bg-white text-center rounded-lg border"
      >
        <section className="p-2 flex items-center gap-4">
            <img src="/profile.png" alt="" className="size-20 rounded-full row-span-2" />
            <div className="flex flex-col gap-2">
              <p className="text-3xl text-start" >Akmal Zia</p>
              <p className="">najmundaakmal@gmail.com</p>
            </div>
        </section>
        <div className="p-2 flex items-center gap-4">
          <UserRoundCog size={24} />
          <p className="text-2xl">Account Settings</p>
        </div>
        <div className="p-2 flex items-center gap-4">
          <DatabaseBackup size={24} />
          <p className="text-2xl">Sync Card</p>
        </div>
        <div className="p-2 flex items-center gap-4">
          <LogOut size={24} />
          <p className="text-2xl">Log Out</p>
        </div>
      </div>
    </main>
  )
}