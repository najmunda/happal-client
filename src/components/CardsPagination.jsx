import { useSubmit } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

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
      <button
        type="button"
        onClick={handleButtonClick}
        value={Number(page) - 1}
        className={clsx(
          "px-4 py-2 rounded-lg bg-white border border-neutral-200 shadow-lg hover:shadow-xl",
          {
            visible: page > 1,
            invisible: page == 1,
          },
        )}
        disabled={page == 1}
      >
        <ChevronLeft size={18} className="shrink-0" />
      </button>
      <section className="px-4 py-2 flex items-center gap-2 rounded-lg bg-white border border-neutral-200 shadow-lg hover:shadow-xl">
        <p className="text-sm">{page}</p>
      </section>
      <button
        type="button"
        onClick={handleButtonClick}
        value={Number(page) + 1}
        className={clsx(
          "px-4 py-2 rounded-lg bg-white border border-neutral-200 shadow-lg hover:shadow-xl",
          {
            invisible: isLastPage,
          },
        )}
        disabled={isLastPage}
      >
        <ChevronRight size={18} className="shrink-0" />
      </button>
    </form>
  );
}
