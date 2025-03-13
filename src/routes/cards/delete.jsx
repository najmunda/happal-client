import { useActionData, useLocation, useNavigate, useOutletContext, useSubmit } from "react-router-dom";
import { deleteCardDoc } from "../../db";
import { useEffect } from "react";
import Loading from "../../components/Loading";

export async function action({ params, request }) {
  const {redirect} = await request.json();
  await deleteCardDoc(params.cardId)
  return {
    data: { action: "delete" },
    redirect,
  };
}

export default function CardDelete() {

  const navigate = useNavigate();
  const actionData = useActionData();
  const submit = useSubmit();
  const location = useLocation();
  const prevPathNQuery = location.state?.prevPathNQuery;
  const [handleDialogClose] = useOutletContext();

  function handleBackButton() {
    handleDialogClose();
    navigate(prevPathNQuery);
  }

  function handleSubmit(e) {
    submit({ redirect: prevPathNQuery }, { method: "delete", encType: "application/json" });
    e.preventDefault();
  }

  useEffect(() => {
    if (actionData) {
      const {data, redirect} = actionData;
      navigate(redirect, {state: data, replace: true})
    }
  }, [actionData]);

  return actionData ? 
    <Loading className='h-[33dvh] flex flex-col justify-center items-center' /> : (
    <form onSubmit={handleSubmit} method="delete" className="p-3 h-fit flex flex-col justify-evenly items-center gap-2">
      <p className="text-center">Apakah anda yakin menghapus kartu ini? Jadwal kartu akan ikut terhapus!</p>
      <div className="pt-2 w-full flex justify-center items-center gap-2">
        <button type="button" onClick={handleBackButton} className="px-2">Batal</button>
        <button type="submit" onClick={handleDialogClose} className="px-2">Hapus</button>
      </div>
    </form>
  );
}