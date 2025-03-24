import { useNavigate, useOutletContext } from "react-router-dom";
import { CalendarSync, Info, SquarePen, Trash2 } from "lucide-react";

export default function CardHelp() {

  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate(-1);
  }

  return (
    <section className="p-3 h-fit flex flex-col justify-evenly items-center gap-2">
      <section className="w-full flex flex-col justify-evenly gap-2">
        <h2 className="text-2xl font-bold">Cards?</h2>
        <p className="text-sm">Halaman ini digunakan untuk mengelola kartu-kartu yang telah kamu tambahkan dari Mine.</p>
        <h2 className="text-2xl font-bold">Tombol?</h2>
        <table>
          <tbody>
            <tr>
              <th className="flex gap-1 items-center"><Info size={15} />Info</th><td>: Info detail sebuah kartu.</td>
            </tr>
            <tr>
              <th className="flex gap-1 items-center"><SquarePen size={15} />Edit</th><td>: Ubah sentence, target, dan definition sebuah kartu. Fitur ini digunakan untuk memperbaiki typo atau menambahkan definisi.</td>
            </tr>
            <tr>
              <th className="flex gap-1 items-center"><CalendarSync size={15} />Reset</th><td>: Mereset jadwal munculnya sebuah kartu pada "Sorb".</td>
            </tr>
            <tr>
              <th className="flex gap-1 items-center"><Trash2 size={15} />Hapus</th><td>: Menghapus kartu.</td>
            </tr>
          </tbody>
        </table>
      </section>
      <div className="pt-2 w-full flex justify-center items-center">
        <button type="button" onClick={handleBackButton} className="px-2 hover:bg-neutral-100 rounded-lg">Tutup</button>
      </div>
    </section>
  )
}