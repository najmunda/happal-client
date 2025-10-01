import db, { handleError } from "../../db";
import { cardDocsSchema } from "../../utils/schemas";
import { safeFetch } from "../../utils/utils";

export async function downloadAllCardDoc() {
  try {
    const response = await db.allDocs({
      startkey: "card-",
      endkey: "card-\ufff0",
      include_docs: true,
    });
    const allCardDocs = response.rows.map(
      ({ doc: { sentence, target, def, date_created, srs, _id } }) => ({
        sentence,
        target,
        def,
        date_created,
        srs,
        _id,
      }),
    );
    const date = new Date();
    const year = date.getFullYear();
    const month =
      date.getMonth() + 1 < 10
        ? `0${date.getMonth() + 1}`
        : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const blob = new Blob([JSON.stringify(allCardDocs)], {
      type: "text/json",
    });
    const link = document.createElement("a");
    link.download = `${year}${month}${day}-happal.json`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(
      ":",
    );
    link.dispatchEvent(
      new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
      }),
    );
    link.remove();
    return { success: true };
  } catch (error) {
    await handleError(error, "Terjadi eror saat mendapatkan file cadangan");
  }
}

export async function deleteAllCardDoc() {
  let responses;
  try {
    const response = await db.allDocs({
      include_docs: true,
      startkey: "card-",
      endkey: "card-\ufff0",
    });
    const deletedCardsDoc = response.rows.map((cardDoc) => ({
      ...cardDoc.doc,
      _deleted: true,
    }));
    responses = await db.bulkDocs(deletedCardsDoc);
  } catch (error) {
    await handleError(error, "Seluruh kartu gagal dihapus");
  }
  try {
    if (
      responses.findIndex((response) => Object.hasOwn(response, "error")) !== -1
    ) {
      const failResponses = responses.filter((response) =>
        Object.hasOwn(response, "error"),
      );
      const failMessages = [
        ...new Set(failResponses.map((response) => response?.message ?? "")),
      ];
      throw new Error(null, { cause: failMessages });
    }
    return { success: true, message: "Seluruh kartu berhasil dihapus" };
  } catch (error) {
    await handleError(error, "Beberapa kartu gagal dihapus");
  }
}

export async function importCardDocs(importedFileObjUrl) {
  let responses;
  try {
    const response = await fetch(importedFileObjUrl);
    const fileObj = await response.blob();
    if (fileObj.type !== "application/json") {
      return {
        success: false,
        message: 'File unggahan tidak bertipe ".json", impor dibatalkan',
      };
    }
    const reader = new FileReader();
    const result = await new Promise((resolve, reject) => {
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (event) => {
        reject(event.target.result);
      };
      reader.readAsText(fileObj);
    });
    const cardDocs = JSON.parse(result);
    const { error } = cardDocsSchema.validate(cardDocs, {
      abortEarly: true,
    });
    if (error) {
      return {
        success: false,
        message: "Struktur file cadangan tidak valid, impor dibatalkan",
      };
    }
    responses = await db.bulkDocs(cardDocs);
  } catch (error) {
    await handleError(error, "Seluruh kartu pada file cadangan gagal diimpor");
  }
  try {
    if (
      responses.findIndex((response) => Object.hasOwn(response, "error")) !== -1
    ) {
      const failResponses = responses.filter((response) =>
        Object.hasOwn(response, "error"),
      );
      const failMessages = [
        ...new Set(failResponses.map((response) => response?.message ?? "")),
      ];
      throw new Error(null, {
        cause: failMessages,
      });
    }
    return {
      success: true,
      message: "Seluruh kartu pada file cadangan berhasil diimpor",
    };
  } catch (error) {
    await handleError(error, "Beberapa kartu pada file cadangan gagal diimpor");
  }
}

export async function uploadLog() {
  let clientLogDoc;
  try {
    clientLogDoc = await db.get("client-log").catch((error) => {
      if (error.name === "not_found") {
        return { _id: "client-log", log: [] };
      } else {
        throw error;
      }
    });
    const clientLog = clientLogDoc["log"];
    if (clientLog !== "") {
      await safeFetch(`${import.meta.env.VITE_SERVER_URL}/log/client`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ log: clientLog }),
        method: "POST",
      });
    }
  } catch (error) {
    throw new Error("Log gagal diunggah");
  }
  try {
    await db.put({ ...clientLogDoc, log: [] });
    return {
      success: true,
      message: "Log berhasil diunggah",
    };
  } catch (error) {
    throw new Error("Log gagal direset, tapi berhasil diunggah");
  }
}
