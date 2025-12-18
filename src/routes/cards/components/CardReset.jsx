import { useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { CalendarSync, X } from "lucide-react";
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
    <fetcher.Form
      method="post"
      action={`${cardDoc._id}/reset`}
      className="h-fit flex flex-col justify-evenly items-center gap-2"
    >
      <p className="text-center">
        Apakah anda yakin untuk mereset jadwal kartu ini?
      </p>
      <div className="w-full flex justify-center items-center gap-2">
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
          variant="warning"
          icon={CalendarSync}
        >
          Reset
        </ButtonAction>
      </div>
    </fetcher.Form>
  );
}
