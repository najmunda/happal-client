import { useEffect } from "react";
import { useFetcher } from "react-router-dom";
import { CalendarSync, X } from "lucide-react";
import { DialogButtons, DialogContent } from "../../../components/Dialog";
import ButtonAction from "../../../components/ButtonAction";

export default function CardDelete({ cardDoc, handleBackToDetailDialog }) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success && fetcher.state === "idle")
      handleBackToDetailDialog();
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <DialogContent
        as={fetcher.Form}
        id="reset-form"
        method="post"
        action={`${cardDoc._id}/reset`}
      >
        <p className="text-center">
          Apakah anda yakin untuk mereset jadwal kartu ini?
        </p>
      </DialogContent>
      <DialogButtons>
        <ButtonAction
          as="button"
          type="button"
          icon={X}
          onClick={handleBackToDetailDialog}
        >
          Batal
        </ButtonAction>
        <ButtonAction
          as="button"
          form="reset-form"
          type="submit"
          variant="warning"
          icon={CalendarSync}
        >
          Reset
        </ButtonAction>
      </DialogButtons>
    </>
  );
}
