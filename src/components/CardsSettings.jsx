import { Form, useSubmit } from "react-router-dom";
import { ArrowDownNarrowWide, CalendarArrowDown, ChevronDown, Filter, Search } from "lucide-react";
import { useEffect } from "react";

export default function CardsSettings({searchParams}) {

  const submit = useSubmit();
  const {q = "", show = "all", order = "desc", sortby = "create"} = searchParams;

  function handleFormChange(e) {
    submit(e.currentTarget)
  }

  useEffect(() => {
    document.getElementById("q").value = q;
    document.getElementById("show").value = show;
    document.getElementById("order").value = order;
    document.getElementById("sortby").value = sortby;
  }, [q, show, order, sortby]);

  return (
    <Form onChange={handleFormChange} className="flex flex-col md:flex-row gap-2">
      <section className="flex-1 px-4 py-2 flex justify-between items-center gap-4 bg-white border rounded-lg">
        <input type="text" name="q" id="q" defaultValue={q} placeholder="Cari kartu..." className="p-0 flex-1 border-0 focus:ring-0" />
        <Search />
      </section>
      <section className="flex items-center gap-2 overflow-auto">
        <section className="p-2 flex flex-col justify-center bg-white border rounded-lg relative">
          <div className="w-full flex justify-between items-center gap-2">
            <Filter size={18} className="shrink-0" />
            <label htmlFor="show" className="text-xs text-nowrap line-clamp-1">Tampilkan</label>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          <select name="show" id="show" defaultValue={show} className="text-xs w-full border-0 opacity-0 absolute left-0">
            <option value="all">Semua Kartu</option>
            <option value="new">Kartu Baru</option>
            <option value="review">Kartu Review</option>
            <option value="learn">Kartu Belajar</option>
          </select>
        </section>
        <section className="p-2 flex flex-col justify-center bg-white border rounded-lg relative">
          <div className={`w-full flex justify-between items-center gap-2 ${q ? 'text-neutral-400' : ''}`}>
            <ArrowDownNarrowWide size={18} className="shrink-0" />
            <label htmlFor="order" className="text-xs text-nowrap line-clamp-1">Urutan</label>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          <select name="order" id="order" defaultValue={order} disabled={q ? true : false} className="w-full text-xs border-0 opacity-0 absolute left-0">
            <option value="desc">Menurun</option>
            <option value="asc">Menaik</option>
          </select>
        </section>
        <section className="p-2 flex flex-col justify-center bg-white border rounded-lg relative">
          <div className={`w-full flex justify-between items-center gap-2 ${q ? 'text-neutral-400' : ''}`}>
            <CalendarArrowDown size={18} className="shrink-0" />
            <label htmlFor="sortby" className="text-xs text-nowrap line-clamp-1">Urut berdasarkan</label>
            <ChevronDown size={18} className="shrink-0" />
          </div>
          <select name="sortby" id="sortby" defaultValue={sortby} disabled={q ? true : false} className={`w-full text-xs border-0 opacity-0 absolute left-0`}>
            <option value="create">Tanggal dibuat</option>
            <option value="due">Review selanjutnya</option>
            <option value="review">Review terakhir</option>
          </select>
        </section>
      </section>
    </Form>
  )
}