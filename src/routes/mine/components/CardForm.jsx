import { BookA, Trash2 } from "lucide-react";
import TextArea from "../../../components/TextArea";
import ButtonAction from "../../../components/ButtonAction";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import clsx from "clsx";

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
    <Card
      as="form"
      name={`card_${formIndex}`}
      data-formindex={formIndex}
      className={clsx("h-fit flex flex-col items-stretch gap-2 relative", {
        "border-2 border-danger dark:border-danger-dark": isError,
      })}
    >
      {isError ? (
        <div className="bg-danger dark:bg-danger-dark size-4 -top-1 -right-2 absolute rounded-full"></div>
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
        className="w-full text-center text-xs"
        placeholder="Taruh kalimat disini..."
        required
      ></TextArea>
      <Input
        type="text"
        name={`target`}
        id={`target_${formIndex}`}
        value={target}
        autoComplete="off"
        onChange={handleTargetChange}
        className="w-full text-center"
        placeholder="Ketik/sorot target kata/frasa pada kalimat..."
        required
      />
      <TextArea
        type="text"
        name={`def`}
        id={`def_${formIndex}`}
        value={def}
        onChange={handleDefChange}
        className="w-full text-center text-xs"
        placeholder="Tambah definisi dari kamus..."
        required
      ></TextArea>
      {target && (
        <ul className="flex gap-1 pb-1 overflow-x-auto">
          <ButtonAction
            as="a"
            href={`https://www.merriam-webster.com/dictionary/${target}`}
            icon={BookA}
            variant="success"
            target="_blank"
            rel="noopener noreferrer"
          >
            Merriam-Webster
          </ButtonAction>
        </ul>
      )}
      {cardCount != 1 ? (
        <div className="flex justify-evenly text-xs">
          {cardCount != 1 ? (
            <ButtonAction
              as="button"
              type="button"
              value="delete"
              icon={Trash2}
              variant="danger"
            >
              Hapus Form
            </ButtonAction>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </Card>
  );
}
