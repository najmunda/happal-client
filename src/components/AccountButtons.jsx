import clsx from "clsx";
import { CloudAlert, FileDown, FileUp, Trash2 } from "lucide-react";
import { useRef } from "react";
import { useSubmit } from "react-router-dom";
import { OnlineContext } from "../routes/root/root";
import { useContext } from "react";

export default function AccountButtons() {
  const importBtnRef = useRef();
  const submit = useSubmit();
  const isOnline = useContext(OnlineContext);

  function handleImportButton(e) {
    importBtnRef.current.click();
    e.preventDefault();
  }

  function handleImportChange(e) {
    const importedFiles = importBtnRef.current.files[0];
    const importFormData = new FormData();
    importFormData.append("intent", "import");
    importFormData.append("file", URL.createObjectURL(importedFiles));
    submit(importFormData, { action: "/account", method: "post" });
    e.preventDefault();
  }

  return (
    <>
      <button
        type="submit"
        name="intent"
        value="download"
        className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"
      >
        <FileDown />
        Unduh file cadangan
      </button>
      <button
        type="submit"
        name="intent"
        value="delete"
        className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"
      >
        <Trash2 />
        Hapus semua kartu
      </button>
      <button
        type="button"
        onClick={handleImportButton}
        className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"
      >
        <FileUp />
        Import file cadangan
      </button>
      <input
        type="file"
        ref={importBtnRef}
        accept=".json"
        onChange={handleImportChange}
        name="import"
        id="import"
        className="hidden"
      />
      <button
        type="submit"
        name="intent"
        value="upload-log"
        className={clsx("p-2 flex gap-2 items-center text-left", {
          "text-black hover:bg-neutral-100 cursor-pointer": isOnline === true,
          "text-neutral-400 cursor-default": isOnline === false,
        })}
      >
        <CloudAlert />
        Unggah log eror
      </button>
    </>
  );
}
