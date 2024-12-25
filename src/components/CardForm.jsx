import { useState } from "react";

export default function CardForm({ num }) {

  const [sentence, setSentence] = useState("");
  const [target, setTarget] = useState("");
  const [def, setDef] = useState("");

  function handleSentenceChange(e) {
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
    <form name={`card_${num}`} className="p-3 flex flex-col items-center gap-3 border rounded">
      <textarea
        type="text"
        name={`sentence`}
        id={`sentence_${num}`}
        value={sentence}
        onChange={handleSentenceChange}
        onSelect={handleSentenceSelect}
        className="w-3/4 text-center text-xl border rounded p-2"
        placeholder="Put sentence here..."
      ></textarea>
      {sentence &&
        <input
          type="text"
          name={`target`}
          id={`target_${num}`}
          value={target}
          className="w-3/4 text-center text-lg border rounded p-2"
          placeholder="Highlight some words from sentence..."
          readOnly
        />
      }
      {target &&
        <textarea
          type="text"
          name={`def`}
          id={`def_${num}`}
          value={def}
          onChange={handleDefChange}
          className="w-3/4 text-center text-md border rounded p-2"
          placeholder="Add def from dictionary..."
        ></textarea>
      }
    </form>
  );
}