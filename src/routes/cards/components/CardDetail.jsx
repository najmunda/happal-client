import { Interweave } from "interweave";
import { CalendarSync, Eye, Repeat2, SquarePen, Trash2, X } from "lucide-react";
import { formatDate } from "../../../utils/utils";
import ButtonAction from "../../../components/ButtonAction";
import { Link } from "react-router-dom";

export default function CardDetail({ showedCardDoc, handleDialogClose }) {
  const cardDoc = showedCardDoc;

  const sentence = cardDoc?.sentence.replace(
    cardDoc?.target,
    `<b>${cardDoc?.target}</b>`,
  );
  const def = cardDoc?.def;
  const due = cardDoc?.srs.card.due;
  const lastReview = cardDoc?.srs.card.last_review;
  const reps = cardDoc?.srs.card.reps;
  const dateCreated = cardDoc?.date_created;

  return (
    <>
      <p className="pb-2 w-full text-2xl text-pretty">
        <Interweave content={sentence} />
      </p>
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
          as={Link}
          variant="success"
          // to={`${card._id}/edit`}
        >
          <SquarePen size={15} />
          Edit
        </ButtonAction>
        {cardDoc?.srs?.card.state !== 0 && (
          <ButtonAction
            as={Link}
            variant="warning"
            // to={`${card._id}/reset`}
          >
            <CalendarSync size={15} />
            Reset
          </ButtonAction>
        )}
        <ButtonAction
          as={Link}
          variant="danger"
          // to={`${card._id}/delete`}
        >
          <Trash2 size={15} /> Hapus
        </ButtonAction>
      </div>
    </>
  );
}
