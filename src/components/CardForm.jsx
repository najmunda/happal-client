import { Trash2 } from "lucide-react";
import TextArea from "./TextArea";
import ButtonAction from "./ButtonAction";

export default function CardForm({
  form,
  cardCount,
  isError,
  handleFormChange,
}) {
  const formIndex = form.index;
  const { sentence, target, def } = form;

  function handleSentenceChange(e) {
    if (e.currentTarget.value == "") {
      handleFormChange({
        index: formIndex,
        sentence: e.currentTarget.value,
        target: "",
        def: "",
      });
    } else {
      handleFormChange({
        index: formIndex,
        sentence: e.currentTarget.value,
        target,
        def,
      });
    }
  }

  function handleSentenceSelect(e) {
    const substring = e.currentTarget.value.substring(
      e.target.selectionStart,
      e.target.selectionEnd,
    );
    if (substring != "") {
      handleFormChange({ index: formIndex, sentence, target: substring, def });
    }
  }

  function handleTargetChange(e) {
    handleFormChange({
      index: formIndex,
      sentence,
      target: e.currentTarget.value,
      def,
    });
  }

  function handleDefChange(e) {
    handleFormChange({
      index: formIndex,
      sentence,
      target,
      def: e.currentTarget.value,
    });
  }

  return (
    <form
      name={`card_${formIndex}`}
      data-formindex={formIndex}
      className={`h-fit p-2 flex flex-col items-stretch gap-2 bg-white shadow ${isError ? "border-2 border-red-100" : ""} rounded-lg hover:shadow-md relative`}
    >
      {isError ? (
        <div className="bg-red-400 size-4 -top-1 -right-2 absolute rounded-full"></div>
      ) : (
        <></>
      )}
      <TextArea
        type="text"
        name={`sentence`}
        id={`sentence_${formIndex}`}
        value={sentence}
        onChange={handleSentenceChange}
        onSelect={handleSentenceSelect}
        className="w-full text-center text-xs border border-neutral-200 rounded p-2"
        placeholder="Taruh kalimat disini..."
        required
      ></TextArea>
      <input
        type="text"
        name={`target`}
        id={`target_${formIndex}`}
        value={target}
        onChange={handleTargetChange}
        className="w-full text-center border border-neutral-200 rounded p-2"
        placeholder="Ketik/sorot target kata/frasa pada kalimat..."
        required
      />
      <TextArea
        type="text"
        name={`def`}
        id={`def_${formIndex}`}
        value={def}
        onChange={handleDefChange}
        className="w-full text-center text-xs border border-neutral-200 rounded p-2"
        placeholder="Tambah definisi dari kamus..."
        required
      ></TextArea>
      {target && (
        <ul className="flex gap-1 pb-1 overflow-x-auto">
          <a
            href={`https://www.merriam-webster.com/dictionary/${target}`}
            className="text-nowrap bg-white px-2 py-1 text-xs border rounded-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            Merriam-Webster
          </a>
        </ul>
      )}
      {cardCount != 1 ? (
        <div className="flex justify-evenly text-xs">
          {cardCount != 1 ? (
            <ButtonAction
              as="button"
              type="button"
              value="delete"
              variant="danger"
            >
              <Trash2 size={15} /> Hapus Form
            </ButtonAction>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </form>
  );
}
