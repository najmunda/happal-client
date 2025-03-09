import { Trash2 } from "lucide-react";
import TextArea from "./TextArea";

export default function CardForm({ form, cardCount, isError, handleFormChange }) {

  const formIndex = form.index;
  const {sentence, target, def} = form;

  function handleSentenceChange(e) {
    if (e.currentTarget.value == "") {
      handleFormChange({index: formIndex, sentence: e.currentTarget.value, target: "", def: ""});
    } else {
      handleFormChange({index: formIndex, sentence: e.currentTarget.value, target, def});
    }
  }

  function handleSentenceSelect(e) {
    const substring = e.currentTarget.value.substring(e.target.selectionStart, e.target.selectionEnd);
    if (substring != "") {
      handleFormChange({index: formIndex, sentence, target: substring, def});
    }
  }

  function handleDefChange(e) {
    handleFormChange({index: formIndex, sentence, target, def: e.currentTarget.value});
  }

  return (
    <form name={`card_${formIndex}`} data-formindex={formIndex} className={`h-fit p-2 flex flex-col items-center gap-2 bg-white border ${isError ? "border-red-500 border-2" : "border-black"} rounded-lg`}>
      <TextArea
        type="text"
        name={`sentence`}
        id={`sentence_${formIndex}`}
        value={sentence}
        onChange={handleSentenceChange}
        onSelect={handleSentenceSelect}
        className="w-full text-center text-xs border border-black rounded p-2"
        placeholder="Put sentence here..."
        required
      ></TextArea>
      <input
        type="text"
        name={`target`}
        id={`target_${formIndex}`}
        value={target}
        className="w-full text-center border border-black rounded p-2"
        placeholder="Highlight words/phrase from sentence..."
        readOnly
        required
      />
      <TextArea
        type="text"
        name={`def`}
        id={`def_${formIndex}`}
        value={def}
        onChange={handleDefChange}
        className="w-full text-center text-xs border border-black rounded p-2"
        placeholder="Add def from dictionary..."
        required
      ></TextArea>
      {cardCount != 1 ?
        <div className="flex justify-evenly text-xs">
          {cardCount != 1 ? <button type="button" value="delete" className="px-2 py-1 flex gap-1 hover:bg-neutral-100 rounded-lg"><Trash2 size={15} /> Hapus Form</button> : <></>}
        </div> : <></>
      }
    </form>
  );
}