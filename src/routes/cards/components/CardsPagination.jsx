import { useSubmit } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import Card from "../../../components/Card";

export default function CardsPagination({ searchParams, isLastPage }) {
  const submit = useSubmit();
  const { page = 1 } = searchParams;

  function handleButtonClick(e) {
    submit({ ...searchParams, page: e.currentTarget.value }, { method: "get" });
  }

  return (
    <form
      className={clsx(
        "flex justify-center items-center gap-2 sticky bottom-2 self-center",
        {
          hidden: page == 1 && isLastPage,
        },
      )}
    >
      <Card
        as="button"
        type="button"
        onClick={handleButtonClick}
        value={Number(page) - 1}
        className={clsx("cursor-pointer", {
          visible: page > 1,
          invisible: page == 1,
        })}
        disabled={page == 1}
      >
        <ChevronLeft size={18} className="shrink-0" />
      </Card>
      <Card as="section" className="flex items-center gap-2">
        <p className="text-sm cursor-default">{page}</p>
      </Card>
      <Card
        as="button"
        type="button"
        onClick={handleButtonClick}
        value={Number(page) + 1}
        className={clsx("cursor-pointer", {
          invisible: isLastPage,
        })}
        disabled={isLastPage}
      >
        <ChevronRight size={18} className="shrink-0" />
      </Card>
    </form>
  );
}
