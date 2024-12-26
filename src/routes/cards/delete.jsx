import { redirect } from "react-router-dom";
import { deleteCard } from "../../db";

export async function action({ params }) {
  await deleteCard(params.cardId)
  return redirect('/cards');
}