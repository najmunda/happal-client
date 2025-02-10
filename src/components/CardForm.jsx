import { useState } from "react";
import { Trash2 } from "lucide-react";
import TextArea from "./TextArea";

export default function CardForm({ formIndex, cardCount, isError }) {

  const [sentence, setSentence] = useState("");
  const [target, setTarget] = useState("");
  const [def, setDef] = useState("");

  function handleSentenceChange(e) {
    if (e.currentTarget.value == "") {
      setTarget("");
      setDef("");
    }
    setSentence(e.currentTarget.value);
  }

  function handleSentenceSelect(e) {
    const substring = e.currentTarget.value.substring(e.target.selectionStart, e.target.selectionEnd);
    if (substring != "") {
      setTarget(substring);
    }
  }

  function handleDefChange(e) {
    setDef(e.currentTarget.value);
  }

  return (
    <form name={`card_${formIndex}`} data-formindex={formIndex} className={`group p-2 flex flex-col items-center gap-2 bg-white border ${isError ? "border-red-500 border-2" : ""} rounded-lg`}>
      <TextArea
        type="text"
        name={`sentence`}
        id={`sentence_${formIndex}`}
        value={sentence}
        onChange={handleSentenceChange}
        onSelect={handleSentenceSelect}
        className="w-full text-center text-xs border rounded p-2"
        placeholder="Put sentence here..."
        required
      ></TextArea>
      <input
        type="text"
        name={`target`}
        id={`target_${formIndex}`}
        value={target}
        className="w-full text-center border rounded p-2"
        placeholder="Highlight words from sentence..."
        readOnly
        required
      />
      <TextArea
        type="text"
        name={`def`}
        id={`def_${formIndex}`}
        value={def}
        onChange={handleDefChange}
        className="w-full text-center text-xs border rounded p-2"
        placeholder="Add def from dictionary..."
        required
      ></TextArea>
      {cardCount != 1 ?
        <div className="hidden justify-evenly text-xs group-hover:flex">
          {cardCount != 1 ? <button type="button" value="delete" className="flex gap-1"><Trash2 size={15} /> Delete</button> : <></>}
        </div> : <></>
      }
    </form>
  );
}