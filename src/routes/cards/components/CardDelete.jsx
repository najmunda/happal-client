import { useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { DialogButtons, DialogContent } from "../../../components/Dialog";
import ButtonAction from "../../../components/ButtonAction";

export default function CardDelete({
  cardDoc,
  handleDialogClose,
  handleCancelConfirmDialog,
}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success && fetcher.state === "idle") handleDialogClose();
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <DialogContent
        as={fetcher.Form}
        id="delete-form"
        method="delete"
        action={`${cardDoc._id}/delete`}
      >
        <p className="text-center">
          Apakah anda yakin menghapus kartu ini? Jadwal kartu akan ikut
          terhapus!
        </p>
      </DialogContent>
      <DialogButtons>
        <ButtonAction
          as="button"
          type="button"
          icon={X}
          onClick={handleCancelConfirmDialog}
        >
          Batal
        </ButtonAction>
        <ButtonAction
          as="button"
          type="submit"
          form="delete-form"
          variant="danger"
          icon={Trash2}
        >
          Hapus
        </ButtonAction>
      </DialogButtons>
    </>
  );
}
