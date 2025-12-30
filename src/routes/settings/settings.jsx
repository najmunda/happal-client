import { useRef, useState } from "react";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import {
  CloudAlert,
  FileDown,
  FileUp,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { getCardDocTotal } from "../../db";
import Toast from "../../components/Toast";
import { logError } from "../../utils/logger";
import {
  deleteAllCardDoc,
  downloadAllCardDoc,
  downloadErrorLog,
  importCardDocs,
} from "./db";
import Card from "../../components/Card";
import ButtonMenu from "./components/ButtonMenu";
import ButtonAction from "../../components/ButtonAction";

export async function loader() {
  const { payload: cardDocsTotal } = await getCardDocTotal();
  return {
    cardDocsTotal, // All cards total (nothing excluded)
  };
}

export async function action({ request }) {
  try {
    const formData = await request.formData();
    const intent = formData.get("intent");
    let response;
    switch (intent) {
      case "delete": {
        response = await deleteAllCardDoc();
        break;
      }
      case "download": {
        response = await downloadAllCardDoc();
        break;
      }
      case "import": {
        response = await importCardDocs(formData.get("file"));
        break;
      }
      case "download-error-log": {
        response = await downloadErrorLog();
        break;
      }
      default: {
        break;
      }
    }
    if (response?.message) {
      toast.custom(() => (
        <Toast
          message={response.message}
          type={response.success ? "success" : "error"}
        />
      ));
    }
    return null;
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Terjadi eror, aksi dibatalkan";
    toast.custom(() => <Toast message={error.message} type="error" />);
    return null;
  }
}

export function Component() {
  const { cardDocsTotal } = useLoaderData();
  const navigation = useNavigation();
  const isLoading =
    navigation.state === "loading" || navigation.state === "submitting";

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
          <Form method="post" className="flex flex-col">
            <p className="p-2 text-left text-content-secondary dark:text-content-secondary-dark text-sm">
              Sinkronisasi Lokal
            </p>
            <ButtonMenu
              type="submit"
              name="intent"
              value="download"
              disabled={cardDocsTotal <= 0}
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
              <div className="p-2 flex gap-2 items-center text-left relative">
                <TriangleAlert />
                <p className="flex-1">Anda yakin?</p>
                <div className="flex gap-2 items-center absolute right-2">
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
                    type="submit"
                    name="intent"
                    value="delete"
                    variant="danger"
                    icon={Trash2}
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
            <ButtonMenu type="submit" name="intent" value="download-error-log">
              <CloudAlert />
              Unduh log eror
            </ButtonMenu>
          </Form>
        )}
      </Card>
    </main>
  );
}

Component.displayName = "AccountRoute";
