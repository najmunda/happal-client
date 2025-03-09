import { useNavigate, useOutletContext } from "react-router-dom";
import { SquarePlus, Trash2 } from "lucide-react";

export default function MineHelp() {

  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate(-1);
  }

  return (
    <section className="p-3 h-fit flex flex-col justify-evenly items-center gap-2">
      <section className="w-full flex flex-col justify-evenly gap-2">
        <h2 className="text-2xl font-bold">Mine?</h2>
        <p className="text-sm">Halaman ini digunakan untuk membuat kartu untuk kamu hafalkan. Sebuah kartu terdiri dari Sentence, Target, dan Definition</p>
        <h2 className="text-2xl font-bold">Sentence? Target? Definition?</h2>
        <table>
          <tbody>
            <tr>
              <th className="flex items-center">Target</th><td>: Kata/frasa yang ingin kamu hafalkan.</td>
            </tr>
            <tr>
              <th className="flex items-center">Sentence</th><td>: Kalimat dari kata/frasa yang kamu hafalkan. Highlight target untuk menulis target pada form.</td>
            </tr>
            <tr>
              <th className="flex items-center">Definition</th><td>: Arti/definisi dari kata/frasa tersebut.</td>
            </tr>
          </tbody>
        </table>
        <h2 className="text-2xl font-bold">Satu Kartu, Satu Target</h2>
        <p className="text-sm">Satu kartu hanya digunakan untuk menghafal satu target (kata/frasa). Jika dalam 1 kalimat terdapat beberapa target yang tidak kamu hafal, buat beberapa kartu dengan target berbeda namun dengan kalimat yang sama.</p>
        <h2 className="text-2xl font-bold">Tambah Form? Simpan Kata?</h2>
        <table>
          <tbody>
            <tr>
              <th className="flex gap-1 items-center"><SquarePlus size={15} />Tambah Form</th><td>: Menambah form kata.</td>
            </tr>
            <tr>
              <th className="flex gap-1 items-center"><SquarePlus size={15} />Simpan Kata</th><td>: Menyimpan seluruh kartu.</td>
            </tr>
            <tr>
              <th className="flex gap-1 items-center"><Trash2 size={15} />Delete Form</th><td>: Menghapus form.</td>
            </tr>
          </tbody>
        </table>
      </section>
      <div className="pt-2 w-full flex justify-center items-center">
        <button type="button" onClick={handleBackButton} className="px-2">Close</button>
      </div>
    </section>
  )
}