import { Form, redirect, useNavigate, useOutletContext } from "react-router-dom";
import { resetCard } from "../../db";

export async function action({ params }) {
  await resetCard(params.cardId)
  return redirect('/cards');
}

export default function CardReset() {

  const navigate = useNavigate();

  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate(-1);
  }

  return (
    <Form method="post" className="p-3 h-fit flex flex-col justify-evenly items-center gap-2">
      <p className="text-center">Apakah anda yakin untuk mereset jadwal kartu ini?</p>
      <div className="pt-2 w-full flex justify-center items-center gap-2">
        <button type="button" onClick={handleBackButton} className="px-2">Batal</button>
        <button type="submit" onClick={handleBackButton} className="px-2">Reset</button>
      </div>
    </Form>
  );
}