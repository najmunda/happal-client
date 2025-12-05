import { Form, useSubmit } from "react-router-dom";
import {
  ArrowDownNarrowWide,
  CalendarArrowDown,
  Filter,
  Search,
} from "lucide-react";
import { useState } from "react";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Select from "./Select";
import CheckBox from "./CheckBox";

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
      <Card
        as="section"
        className="flex-1 flex justify-between items-center gap-4"
      >
        <Input
          type="text"
          name="q"
          id="q"
          defaultValue={q}
          placeholder="Cari kartu..."
          className="p-0 flex-1"
        />
        <Search />
      </Card>
      <Card as="section" className="flex items-center gap-2 overflow-auto">
        <section className="grow flex gap-2 items-center has-disabled:text-content-secondary dark:has-disabled:text-content-secondary-dark relative">
          <CalendarArrowDown size={18} className="shrink-0" />
          <label
            htmlFor="sortby"
            className="absolute md:static invisible md:visible text-xs text-nowrap"
          >
            Urut berdasar
          </label>
          <Select
            name="sortby"
            id="sortby"
            value={q ? "search" : sortby}
            disabled={q ? true : false}
            className="grow"
            readOnly
          >
            {q ? <option value="search">Pencarian</option> : <></>}
            <option value="create">Tanggal dibuat</option>
            <option value="due">Review selanjutnya</option>
            <option value="review">Review terakhir</option>
          </Select>
          {q && <input type="hidden" name="sortby" value={sortby} />}
        </section>
        <section className="grow flex gap-2 items-center has-disabled:text-content-secondary dark:has-disabled:text-content-secondary-dark relative">
          <ArrowDownNarrowWide size={18} className="shrink-0" />
          <label
            htmlFor="order"
            className="absolute md:static invisible md:visible text-xs text-nowrap"
          >
            Urutan
          </label>
          <Select
            name="order"
            id="order"
            value={q ? "asc" : order}
            disabled={q ? true : false}
            readOnly
            className="grow"
          >
            <option value="desc">Menurun</option>
            <option value="asc">Menaik</option>
          </Select>
          {q && <input type="hidden" name="order" value={order} />}
        </section>
      </Card>
      <Card as="section" className="col-span-2 flex items-center gap-2">
        <Filter size={18} className="shrink-0" />
        <p className="absolute md:static invisible md:visible text-xs text-nowrap">
          Tampilkan
        </p>
        <ul
          className="flex gap-2 overflow-x-auto"
          onClickCapture={handleShowChange}
        >
          {showCheckData.map(({ id, value, caption }) => (
            <CheckBox.Label key={id} htmlFor={id}>
              <CheckBox.Input
                type="checkbox"
                name="show"
                id={id}
                value={value}
                defaultChecked={show.includes(value)}
              />
              {caption}
            </CheckBox.Label>
          ))}
        </ul>
      </Card>
    </Form>
  );
}
