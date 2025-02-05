import { useEffect, useRef } from "react";
import { Form, useSubmit } from "react-router-dom";
import { ArrowDownNarrowWide, CalendarArrowDown } from "lucide-react";

export default function CardsOptionDialog({isOpen, searchParams, handleDialogClose}) {

  const dialogRef = useRef();
  const submit = useSubmit();
  const {order, sortby} = searchParams;
  
  function handleBackdropClick(e) {
    if (e.target == dialogRef.current) {
      handleDialogClose();
    };
  }

  function handleBackButton() {
    handleDialogClose();
  }

  function handleEscDown(e) {
    if (e.key == "Escape") {
      handleDialogClose();
    };
  }

  function handleFormChange(e) {
    submit(e.currentTarget);
  }

  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} onClick={handleBackdropClick} onKeyDown={handleEscDown} className="w-full bottom-0 border rounded-lg">
      <Form onChange={handleFormChange} className="p-3 h-fit flex flex-col justify-evenly items-stretch gap-2">
        <label htmlFor="order" className="pt-2 pl-2 text-xs flex items-center gap-2"><ArrowDownNarrowWide size={18} /> Urutan</label>
        <select name="order" id="order" defaultValue={order} className="w-full font-lg border rounded p-2">
          <option value="desc">Menurun</option>
          <option value="asc">Menaik</option>
        </select>
        <label htmlFor="sortby" className="pt-2 pl-2 text-xs flex items-center gap-2"><CalendarArrowDown size={18} /> Urut berdasar</label>
        <select name="sortby" id="sortby" defaultValue={sortby} className="w-full font-lg border rounded p-2">
          <option value="create">Tanggal dibuat</option>
          <option value="due">Review selanjutnya</option>
          <option value="review">Review terakhir</option>
        </select>
        <div className="pt-2 w-full flex justify-end items-center">
          <button type="button" onClick={handleBackButton} className="px-2">Tutup</button>
        </div>
      </Form>
    </dialog>
  )
}