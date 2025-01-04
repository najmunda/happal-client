import { json, Navigate, useActionData } from "react-router-dom";
import { deleteCard } from "../../db";

export async function action({ params }) {
  await deleteCard(params.cardId)
  return json({
    redirect: "/cards",
    data: { message: "Card deleted" },
  });
}

export default function CardDelete() {

  console.log("Comp");
  const { redirect, data } = useActionData();

  return <Navigate to={redirect} state={data} replace />
}