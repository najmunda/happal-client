import { useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Interweave } from "interweave";
import { CircleAlert, Eye, Repeat2 } from "lucide-react";
import { getCardDoc } from "../../db";
import { formatDate } from "../../utils/utils";
import { logError } from "../../utils/logger";

export async function loader({ params }) {
  try {
    const { payload: cardDoc } = await getCardDoc(params.cardId);
    return { error: null, cardDoc };
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Detail kartu gagal didapatkan";
    return { error, cardDoc: null };
  }
}

export default function CardInfo() {
  const { error, cardDoc } = useLoaderData();
  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate(-1);
  }

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
    <section className="p-3 h-fit flex flex-col justify-evenly items-center gap-2">
      {cardDoc !== null && error === null ? (
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
        </>
      ) : (
        <>
          <CircleAlert size={60} />
          <p className="pb-2 w-full text-lg text-center">{error.message}.</p>
        </>
      )}
      <div className="w-full flex justify-center items-center gap-2">
        <button
          type="button"
          onClick={handleBackButton}
          className="px-2 hover:bg-neutral-100"
        >
          Tutup
        </button>
      </div>
    </section>
  );
}
