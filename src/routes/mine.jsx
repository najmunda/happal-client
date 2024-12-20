import { useState } from "react"
import { Form } from "react-router-dom"

export default function Mine() {
  const [sentence, setSentence] = useState("");
  const [word, setWord] = useState("");
  const [def, setDef] = useState("");

  function handleSentenceChange(e) {
    setSentence(e.currentTarget.value);
  }

  function handleSentenceSelect(e) {
    const substring = e.currentTarget.value.substring(e.target.selectionStart, e.target.selectionEnd);
    if (substring != "") {
      setWord(substring);
    }
  }

  function handleDefChange(e) {
    setDef(e.currentTarget.value);
  }

  return (
    <Form className="flex flex-col items-stretch gap-3">
      <div className="p-3 flex flex-col items-center gap-3 border rounded">
        <textarea
          type="text"
          name=""
          id=""
          value={sentence}
          onChange={handleSentenceChange}
          onSelect={handleSentenceSelect}
          className="w-3/4 text-center text-xl border rounded p-2"
          placeholder="Put sentence here..."
        ></textarea>
        {sentence &&
          <input
            type="text"
            value={word}
            className="w-3/4 text-center text-lg border rounded p-2"
            placeholder="Highlight some words from sentence..."
            readOnly
          />
        }
        {word &&
          <textarea
            type="text"
            value={def}
            onChange={handleDefChange}
            className="w-3/4 text-center text-md border rounded p-2"
            placeholder="Add def from dictionary..."
          ></textarea>
        }
      </div>
      <button type="submit" className="p-2 border rounded">Save Card</button>
    </Form>
  )
}