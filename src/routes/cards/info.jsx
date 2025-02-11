import { redirect, useLoaderData, useNavigate, useOutletContext } from "react-router-dom";
import { Interweave } from "interweave";
import { Eye, Repeat2 } from "lucide-react";
import { editCard, getCard } from "../../db";
import { formatDate } from "../../utils";

export async function action({ request, params }) {
  const cardsForm = await request.formData();
  const cardsData = Object.fromEntries(cardsForm);
  await editCard(params.cardId, cardsData);
  return redirect('/cards');
}

export async function loader({ params }) {
  const card = await getCard(params.cardId);
  return card;
}

export default function CardInfo() {

  const card = useLoaderData();
  const navigate = useNavigate();
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate('/cards');
  }

  const sentence = card.sentence.replace(card.target, `<b>${card.target}</b>`);
  const def = card.def;
  const due = card.srs.card.due;
  const lastReview = card.srs.card.last_review;
  const reps = card.srs.card.reps;
  const dateCreated = card.date_created;

  return (
    <section className="p-3 h-fit flex flex-col justify-evenly items-center gap-2">
      <p
        className="pb-2 w-full text-2xl text-pretty"
      ><Interweave content={sentence} /></p>
      <p className="pb-2 w-full text-xl text-pretty"
      >{def}</p>
      <section className="w-full flex justify-evenly flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Repeat2 size={24} />
          <div className="flex flex-col">
            <p className="text-xs">Review Selanjutnya</p>
            <p>{due ? formatDate(due) : '-'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Repeat2 size={24} />
          <div className="flex flex-col">
            <p className="text-xs">Dilihat terakhir</p>
            <p>{lastReview ? formatDate(lastReview) : '-'}</p>
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
            <p>{dateCreated ? formatDate(dateCreated) : '-'}</p>
          </div>
        </div>
      </section>
      <div className="pt-2 w-full flex justify-end items-center">
        <button type="button" onClick={handleBackButton} className="px-2">Close</button>
      </div>
    </section>
  )
}