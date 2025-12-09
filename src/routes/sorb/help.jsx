import { useNavigate, useOutletContext } from "react-router-dom";
import ButtonAction from "../../components/ButtonAction";
import { X } from "lucide-react";

export function Component() {
  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate("/sorb");
  }

  return (
    <>
      <section className="w-full flex flex-col justify-evenly gap-2">
        <h2 className="text-2xl font-bold">Sorb?</h2>
        <p className="text-sm">
          Halaman ini digunakan untuk menghafal kartu-kartu yang telah kamu
          tambahkan dari Mine. Setiap harinya akan ada tumpukan kartu yang bisa
          kamu review.
        </p>
        <h2 className="text-2xl font-bold">Card Counter</h2>
        <p className="text-sm">
          Kartu memiliki 3 status, berdasarkan temponya (selang waktu kamu akan
          menemui kartu). Card counter menampilkan jumlah kartu tersisa yang
          harus kamu review hari ini berdasarkan statusnya.
        </p>
        <p className="text-sm text-content bg-success">
          Warna hijau menampilkan jumlah kartu yang belum pernah kamu
          review/baru ditambahkan. (New Cards)
        </p>
        <p className="text-sm text-content bg-danger">
          Warna merah menampilkan jumlah kartu tempo kurang dari 1 hari. (Learn
          Cards)
        </p>
        <p className="text-sm text-content bg-warning">
          Warna merah menampilkan jumlah kartu dengan tempo lebih dari 1 hari.
          (Review Cards)
        </p>
        <h2 className="text-2xl font-bold">Review</h2>
        <p className="text-sm">
          Review dilakukan dengan membandingkan tebakanmu dengan informasi yang
          ada di balik kartu, kemudian menilai seberapa hafal kamu pada kartu.
          Terdapat 2 nilai yang bisa kamu berikan:
        </p>
        <h3 className="font-bold">Good</h3>
        <p className="text-sm">
          Beri nilai Good jika kamu bisa mengerti dan mengingat arti dari
          target.
        </p>
        <h3 className="font-bold">Again</h3>
        <p className="text-sm">
          Beri nilai Again jika kamu tidak bisa mengerti dan mengingat arti dari
          target.
        </p>
        <h2 className="text-2xl font-bold">Menilai Kartu</h2>
        <p className="text-sm">
          Beri nilai dengan swipe kartu, menekan keyboard, atau klik tombol yang
          tertera. Ditampilkan juga informasi selang waktu kamu akan bertemu
          kartu itu lagi.
        </p>
      </section>
      <div className="pt-2 w-full flex justify-center items-center">
        <ButtonAction
          as="button"
          type="button"
          icon={X}
          onClick={handleBackButton}
        >
          Tutup
        </ButtonAction>
      </div>
    </>
  );
}

Component.displayName = "SorbHelpRoute";
