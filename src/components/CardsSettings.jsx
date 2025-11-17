import { Form, useSubmit } from "react-router-dom";
import {
  ArrowDownNarrowWide,
  CalendarArrowDown,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";

const initialShowCheckData = [
  {
    id: "check-new",
    value: "new",
    caption: "Kartu Baru",
  },
  {
    id: "check-review",
    value: "review",
    caption: "Kartu Review",
  },
  {
    id: "check-learn",
    value: "learn",
    caption: "Kartu Belajar",
  },
];

export default function CardsSettings({ searchParams }) {
  const submit = useSubmit();
  const { q = "", show = [], order = "desc", sortby = "create" } = searchParams;
  const [showCheckData, setShowCheckData] = useState(
    initialShowCheckData.toSorted((objData) =>
      show.includes(objData.value) ? -1 : 1,
    ),
  );

  function handleFormChange(e) {
    const isFirstSearch = q == "" || q == null;
    submit(e.currentTarget, { replace: !isFirstSearch });
  }

  function handleShowChange(e) {
    if (e.target.tagName === "INPUT") {
      const clickedInputId = e.target.id;
      const clickedShowCheckData = showCheckData.find(
        (item) => item.id === clickedInputId,
      );
      const filteredShowCheckData = showCheckData.filter(
        (item) => item.id !== clickedInputId,
      );
      if (e.target.checked) {
        setShowCheckData([clickedShowCheckData, ...filteredShowCheckData]);
      } else {
        setShowCheckData(
          filteredShowCheckData.toSpliced(
            show.length - 1,
            0,
            clickedShowCheckData,
          ),
        );
      }
    }
  }

  return (
    <Form
      onChange={handleFormChange}
      className="flex flex-col xl:grid grid-cols-2 grid-rows-2 gap-2"
    >
      <section className="flex-1 px-4 py-2 flex justify-between items-center gap-4 bg-white rounded-lg shadow-sm hover:shadow-md">
        <input
          type="text"
          name="q"
          id="q"
          defaultValue={q}
          placeholder="Cari kartu..."
          className="p-0 flex-1 border-0 focus:ring-0"
        />
        <Search />
      </section>
      <section className="px-4 py-2 flex items-center gap-2 overflow-auto rounded-lg bg-white md:shadow-sm hover:shadow-md">
        <section className="grow flex gap-2 items-center has-disabled:text-neutral-400 relative">
          <CalendarArrowDown size={18} className="shrink-0" />
          <label
            htmlFor="sortby"
            className="absolute md:static invisible md:visible text-xs text-nowrap"
          >
            Urut berdasar
          </label>
          <select
            name="sortby"
            id="sortby"
            value={q ? "search" : sortby}
            disabled={q ? true : false}
            className={`grow text-xs rounded-lg border border-neutral-200 cursor-pointer disabled:cursor-default`}
            readOnly
          >
            {q ? <option value="search">Pencarian</option> : <></>}
            <option value="create">Tanggal dibuat</option>
            <option value="due">Review selanjutnya</option>
            <option value="review">Review terakhir</option>
          </select>
          {q && <input type="hidden" name="sortby" value={sortby} />}
        </section>
        <section className="grow flex gap-2 items-center has-disabled:text-neutral-400 relative">
          <ArrowDownNarrowWide size={18} className="shrink-0" />
          <label
            htmlFor="order"
            className="absolute md:static invisible md:visible text-xs text-nowrap"
          >
            Urutan
          </label>
          <select
            name="order"
            id="order"
            value={q ? "asc" : order}
            disabled={q ? true : false}
            readOnly
            className="grow text-xs rounded-lg border border-neutral-200 cursor-pointer disabled:cursor-default"
          >
            <option value="desc">Menurun</option>
            <option value="asc">Menaik</option>
          </select>
          {q && <input type="hidden" name="order" value={order} />}
        </section>
      </section>
      <section className="col-span-2 px-4 py-2 flex items-center gap-2 rounded-lg bg-white md:shadow-sm hover:shadow-md ">
        <Filter size={18} className="shrink-0" />
        <p className="absolute md:static invisible md:visible text-xs text-nowrap">
          Tampilkan
        </p>
        <ul
          className="flex gap-2 overflow-x-auto"
          onClickCapture={handleShowChange}
        >
          {showCheckData.map(({ id, value, caption }) => (
            <label
              key={id}
              htmlFor={id}
              className="relative shrink-0 p-2 text-xs rounded-lg border border-neutral-200 has-checked:bg-green-300 hover:bg-green-100 has-checked:hover:bg-green-100 cursor-pointer"
            >
              <input
                type="checkbox"
                name="show"
                id={id}
                value={value}
                defaultChecked={show.includes(value)}
                className="invisible absolute"
              />
              {caption}
            </label>
          ))}
        </ul>
      </section>
    </Form>
  );
}
