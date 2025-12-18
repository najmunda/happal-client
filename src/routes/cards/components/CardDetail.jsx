import { Interweave } from "interweave";
import { CalendarSync, Eye, Repeat2, SquarePen, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import CardEdit from "./CardEdit";
import CardDelete from "./CardDelete";
import CardReset from "./CardReset";
import { formatDate } from "../../../utils/utils";
import ButtonAction from "../../../components/ButtonAction";

export default function CardDetail({ showedCardDoc, handleDialogClose, focusDialog }) {
  const cardDoc = showedCardDoc;

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

  const [selectedAction, setSelectedAction] = useState("");

  function handleCancelConfirmDialog() {
    setSelectedAction("");
  }

  useEffect(() => {
    focusDialog();
  }, [selectedAction])

  switch (selectedAction) {
    case "edit":
      return (
        <CardEdit
          cardDoc={cardDoc}
          handleDialogClose={handleDialogClose}
          handleCancelConfirmDialog={handleCancelConfirmDialog}
        />
      );
    case "reset":
      return (
        <CardReset
          cardDoc={cardDoc}
          handleDialogClose={handleDialogClose}
          handleCancelConfirmDialog={handleCancelConfirmDialog}
        />
      );
    case "delete":
      return (
        <CardDelete
          cardDoc={cardDoc}
          handleDialogClose={handleDialogClose}
          handleCancelConfirmDialog={handleCancelConfirmDialog}
        />
      );
    default:
      return (
        <>
          <p className="pb-2 w-full text-2xl text-pretty">
            <Interweave content={sentence} />
          </p>
          <p className="pb-2 w-full text-xl text-pretty">{target}</p>
          <p className="pb-2 w-full text-xl text-pretty">{def}</p>
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
          <div className="col-span-2 flex justify-evenly text-xs">
            <ButtonAction
              as="button"
              type="button"
              icon={X}
              onClick={handleDialogClose}
            >
              Close
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
          </div>
        </>
      );
  }
}
