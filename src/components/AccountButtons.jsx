import clsx from "clsx";
import { FileDown, FileUp, Trash2, TriangleAlert, X } from "lucide-react";
import { useRef, useState } from "react";
import { useSubmit } from "react-router-dom";

export default function AccountButtons({ cardDocsTotal }) {
  const importBtnRef = useRef();
  const submit = useSubmit();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      <p className="p-2 text-left text-neutral-400 text-sm">
        Sinkronisasi Lokal
      </p>
      <button
        type="submit"
        name="intent"
        value="download"
        className="p-2 flex gap-2 items-center text-left hover:bg-neutral-100"
      >
        <FileDown />
        <p className="flex-1">Unduh file cadangan</p>
        <p className="text-neutral-400 text-sm">1</p>
      </button>
      {!showDeleteConfirm ? (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className={clsx("p-2 flex gap-2 items-center text-left", {
            "text-black hover:bg-neutral-100": cardDocsTotal > 0,
            "text-neutral-400": cardDocsTotal === 0,
          })}
          disabled={cardDocsTotal === 0}
        >
          <Trash2 />
          <p className="flex-1">Hapus semua kartu</p>
          <p className="text-neutral-400 text-sm">2</p>
        </button>
      ) : (
        <div className="p-2 flex gap-2 items-center text-left relative">
          <TriangleAlert />
          <p className="flex-1">Anda yakin?</p>
          <div className="flex gap-2 items-center absolute right-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2 py-1 text-sm flex items-center gap-1 rounded-lg hover:bg-neutral-100 hover:text-neutral-500"
            >
              <X size={15} />
              Batal
            </button>
            <button
              type="submit"
              name="intent"
              value="delete"
              className="px-2 py-1 text-sm flex items-center gap-1 rounded-lg hover:bg-red-100 hover:text-red-500"
            >
              <Trash2 size={15} />
              Hapus
            </button>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={handleImportButton}
        className={clsx("p-2 flex gap-2 items-center text-left", {
          "text-black hover:bg-neutral-100": cardDocsTotal === 0,
          "text-neutral-400": cardDocsTotal > 0,
        })}
        disabled={cardDocsTotal > 0}
      >
        <FileUp />
        <p className="flex-1">Import file cadangan</p>
        <p className="text-neutral-400 text-sm">3</p>
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
    </>
  );
}
