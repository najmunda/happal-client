import { useRef, useState } from "react";
import { useFetcher, useLoaderData } from "react-router-dom";
import {
  CloudAlert,
  FileDown,
  FileUp,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import Loading from "../../components/Loading";
import { getCardDocTotal } from "../../db";
import Card from "../../components/Card";
import ButtonMenu from "./components/ButtonMenu";
import ButtonAction from "../../components/ButtonAction";

export async function loader() {
  const { payload: cardDocsTotal } = await getCardDocTotal();
  return {
    cardDocsTotal, // All cards total (nothing excluded)
  };
}

export function Component() {
  const { cardDocsTotal } = useLoaderData();
  const fetcher = useFetcher();
  const isLoading =
    fetcher.state === "loading" || fetcher.state === "submitting";
  const importBtnRef = useRef();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleSubmitButton(e) {
    const dataset = e.currentTarget.dataset;
    fetcher.submit(null, { action: dataset.action, method: dataset.method });
    setShowDeleteConfirm(false);
  }

  function handleImportButton(e) {
    importBtnRef.current.click();
    e.preventDefault();
  }

  function handleImportChange(e) {
    const importedFiles = importBtnRef.current.files[0];
    const importFormData = new FormData();
    importFormData.append("file", URL.createObjectURL(importedFiles));
    fetcher.submit(importFormData, { action: "import-cards", method: "post" });
    setShowDeleteConfirm(false);
    e.preventDefault();
  }

  return (
    <main
      className={`container w-dvw md:w-full flex-1 flex flex-col justify-center items-center gap-2 p-2`}
    >
      <Card
        as="div"
        className="w-full max-w-sm flex-[1_1_auto] [@media(min-height:600px)]:flex-[0_1_auto] h-[100px] [@media(min-height:600px)]:h-fit md:max-h-[35rem] flex flex-col items-stretch gap-3 text-center overflow-y-auto"
      >
        {isLoading ? (
          <Loading className="flex-1 flex flex-col justify-center items-center" />
        ) : (
          <div method="post" className="flex flex-col items-stretch">
            <p className="p-2 text-left text-content-secondary dark:text-content-secondary-dark text-sm">
              Sinkronisasi Lokal
            </p>
            <ButtonMenu
              type="button"
              data-method="post"
              data-action="download-cards"
              disabled={cardDocsTotal <= 0}
              onClick={handleSubmitButton}
            >
              <FileDown />
              <p className="flex-1">Unduh file cadangan</p>
              <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
                1
              </p>
            </ButtonMenu>
            {!showDeleteConfirm ? (
              <ButtonMenu
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={cardDocsTotal <= 0}
              >
                <Trash2 />
                <p className="flex-1">Hapus semua kartu</p>
                <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
                  2
                </p>
              </ButtonMenu>
            ) : (
              <div className="p-2 flex gap-2 items-stretch text-left relative">
                <TriangleAlert />
                <p className="flex-1">Anda yakin?</p>
                <div className="flex gap-2 absolute right-0">
                  <ButtonAction
                    as="button"
                    type="button"
                    icon={X}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Batal
                  </ButtonAction>
                  <ButtonAction
                    as="button"
                    type="button"
                    data-method="delete"
                    data-action="delete-cards"
                    variant="danger"
                    icon={Trash2}
                    onClick={handleSubmitButton}
                  >
                    Hapus
                  </ButtonAction>
                </div>
              </div>
            )}
            <ButtonMenu
              type="button"
              onClick={handleImportButton}
              disabled={cardDocsTotal !== 0}
            >
              <FileUp />
              <p className="flex-1">Import file cadangan</p>
              <p className="text-content-secondary dark:text-content-secondary-dark text-sm">
                3
              </p>
            </ButtonMenu>
            <input
              type="file"
              ref={importBtnRef}
              accept=".json"
              onChange={handleImportChange}
              name="import"
              id="import"
              className="hidden"
            />
            <p className="p-2 text-left text-content-secondary dark:text-content-secondary-dark text-sm">
              Pengembangan
            </p>
            <ButtonMenu
              type="button"
              data-method="post"
              data-action="download-error-log"
              onClick={handleSubmitButton}
            >
              <CloudAlert />
              Unduh log eror
            </ButtonMenu>
          </div>
        )}
      </Card>
    </main>
  );
}

Component.displayName = "AccountRoute";
