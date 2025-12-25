import { Interweave } from "interweave";
import {
  CalendarSync,
  CircleAlert,
  Eye,
  Repeat2,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import CardEdit from "./CardEdit";
import CardDelete from "./CardDelete";
import CardReset from "./CardReset";
import { formatDate } from "../../../utils/utils";
import { DialogButtons, DialogContent } from "../../../components/Dialog";
import ButtonAction from "../../../components/ButtonAction";
import { useFetcher } from "react-router-dom";
import Loading from "../../../components/Loading";

export default function CardDetail({
  showedCardId,
  handleDialogClose,
  focusDialog,
}) {
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && !fetcher.data)
      fetcher.load(`${showedCardId}`);
  }, [fetcher]);

  const [selectedAction, setSelectedAction] = useState("");

  function handleBackToDetailDialog() {
    setSelectedAction("");
  }

  useEffect(() => {
    focusDialog();
  }, [selectedAction]);

  if (fetcher.data && fetcher.data["cardDoc"]) {
    const cardDoc = fetcher.data["cardDoc"];
    const sentence = cardDoc?.sentence.replace(
      cardDoc?.target,
      `<b>${cardDoc?.target}</b>`,
    );
    const target = cardDoc?.target;
    const def = cardDoc?.def;
    const due = cardDoc?.srs.card.due;
    const lastReview = cardDoc?.srs.card.last_review;
    const reps = cardDoc?.srs.card.reps;
    const dateCreated = cardDoc?.date_created;

    switch (selectedAction) {
      case "edit":
        return (
          <CardEdit
            cardDoc={cardDoc}
            handleBackToDetailDialog={handleBackToDetailDialog}
          />
        );
      case "reset":
        return (
          <CardReset
            cardDoc={cardDoc}
            handleBackToDetailDialog={handleBackToDetailDialog}
          />
        );
      case "delete":
        return (
          <CardDelete
            cardDoc={cardDoc}
            handleDialogClose={handleDialogClose}
            handleBackToDetailDialog={handleBackToDetailDialog}
          />
        );
      default:
        return (
          <>
            <DialogContent as="div">
              <div className="flex flex-col">
                <p className="text-xs text-content-secondary dark:text-content-secondary-dark">
                  Kalimat
                </p>
                <p className="w-full text-pretty">
                  <Interweave content={sentence} />
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-content-secondary dark:text-content-secondary-dark">
                  Target
                </p>
                <p className="w-full text-pretty">{target}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-content-secondary dark:text-content-secondary-dark">
                  Definisi
                </p>
                <p className="w-full text-pretty">{def}</p>
              </div>
              <section className="w-full flex justify-evenly flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Repeat2 size={24} />
                  <div className="flex flex-col">
                    <p className="text-xs">Review Selanjutnya</p>
                    <p>{due ? formatDate(due) : "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Repeat2 size={24} />
                  <div className="flex flex-col">
                    <p className="text-xs">Dilihat terakhir</p>
                    <p>{lastReview ? formatDate(lastReview) : "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={24} />
                  <div className="flex flex-col">
                    <p className="text-xs">Dilihat</p>
                    <p>{reps} kali</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Repeat2 size={24} />
                  <div className="flex flex-col">
                    <p className="text-xs">Dibuat</p>
                    <p>{dateCreated ? formatDate(dateCreated) : "-"}</p>
                  </div>
                </div>
              </section>
            </DialogContent>
            <DialogButtons>
              <ButtonAction
                as="button"
                type="button"
                icon={X}
                onClick={handleDialogClose}
              >
                Tutup
              </ButtonAction>
              <ButtonAction
                as="button"
                type="button"
                variant="success"
                onClick={() => setSelectedAction("edit")}
              >
                <SquarePen size={15} />
                Edit
              </ButtonAction>
              {cardDoc?.srs?.card.state !== 0 && (
                <ButtonAction
                  as="button"
                  type="button"
                  variant="warning"
                  onClick={() => setSelectedAction("reset")}
                >
                  <CalendarSync size={15} />
                  Reset
                </ButtonAction>
              )}
              <ButtonAction
                as="button"
                type="button"
                variant="danger"
                onClick={() => setSelectedAction("delete")}
              >
                <Trash2 size={15} /> Hapus
              </ButtonAction>
            </DialogButtons>
          </>
        );
    }
  } else if (fetcher.data && fetcher.data["error"]) {
    const error = fetcher.data["error"];
    return (
      <>
        <DialogContent as="div" className="items-center">
          <CircleAlert size={80} />
          <p className="w-full text-center">{error.message}.</p>
        </DialogContent>
        <DialogButtons>
          <ButtonAction
            as="button"
            type="button"
            icon={X}
            onClick={handleDialogClose}
          >
            Close
          </ButtonAction>
        </DialogButtons>
      </>
    );
  } else {
    return (
      <Loading className="h-[33dvh] flex flex-col justify-center items-center" />
    );
  }
}
