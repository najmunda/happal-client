import PouchDB from "pouchdb-browser";
import findPlugin from "pouchdb-find";
import upsertPlugin from "pouchdb-upsert";
import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import Fuse from "fuse.js";
import { logError } from "./utils/logger";
import { getEndTodayUTC, msToDHM } from "./utils/utils";
import { cardDocsSchema } from "./utils/schemas";

PouchDB.plugin(findPlugin);
PouchDB.plugin(upsertPlugin);

// Doc = object of pouchdb document
// cardDoc = object of pouchdb document with id "card-*" inside
// card = object inside cardDoc (cardDoc.srs.card)
// response = response from pouchdb api (db.put, db.remove, etc.)
// Every function return { success: true , message?, payload? } on success process
// Logged error should an original error
// Custom Error with message handled & showed on UI

const db = new PouchDB("sorbit", {
  auto_compaction: true,
  revs_limit: 500,
});

export async function syncDB() {
  try {
    const remoteDb = new PouchDB(`${location.origin}/api/db`, {
      skip_setup: true,
    });

    await new Promise((resolve, reject) => {
      db.sync(remoteDb, {
        style: "main_only",
        filter: (doc) => doc._id.startsWith("card-"),
      })
        .on("complete", (info) => {
          fetch("/api/user/last-sync", { method: "POST" })
            .then(() => {
              resolve(info);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .on("error", (error) => {
          reject(error);
        });
    });
    return { success: true, message: "Seluruh kartu berhasil disinkronkan" };
  } catch (error) {
    await logError(error);
    throw new Error("Terjadi eror saat sinkronisasi", { cause: error });
  }
}

// Root
export async function getAuthedUserDoc() {
  // { _id: "authed-user", id: "", username: "", last_sync: "", avatar_blob: "", pending_logout: false }
  try {
    const authedUserDoc = await db.get("authed-user").catch((error) => {
      if (error.name === "not_found") {
        return { _id: "authed-user" };
      } else {
        throw error;
      }
    });
    return {
      success: true,
      payload: authedUserDoc,
    };
  } catch (error) {
    await logError(error);
    throw new Error("Detail user gagal didapatkan", { cause: error });
  }
}

export async function setAuthedUserDoc(newAuthedUserData) {
  // oldAuthedUserData replaced by newAuthedUserData except _id and _rev
  try {
    const { _id, _rev } = await db.get("authed-user").catch((error) => {
      if (error.name === "not_found") {
        return { _id: "authed-user" };
      } else {
        throw error;
      }
    });
    await db.put(
      Object.assign(
        _rev !== undefined ? { _id, _rev } : { _id },
        newAuthedUserData,
      ),
    );
    return {
      success: true,
    };
  } catch (error) {
    await logError(error);
    throw new Error("Detail user gagal diperbarui", { cause: error });
  }
}

export async function getCardDocTotal() {
  try {
    const response = await db.allDocs({
      startkey: "card-",
      endkey: "card-\ufff0",
    });
    return {
      success: true,
      payload: response.rows.length,
    };
  } catch (error) {
    await logError(error);
    throw new Error("Jumlah kartu gagal didapatkan", { cause: error });
  }
}

const SortBy = Object.freeze({
  create: "date_created",
  due: "srs.card.due",
  review: "srs.card.last_review",
});

const Show = Object.freeze({
  all: [0, 1, 2, 3],
  new: [0],
  learn: [1, 3],
  review: [2],
});

export async function getCardsCustom({
  q = "",
  show = "all",
  order = "desc",
  sortby = "create",
} = {}) {
  try {
    await db.createIndex({
      index: {
        fields: [SortBy[sortby], "srs.card.state"],
        ddoc: `${sortby}-index`,
      },
    });
    const response = await db.find({
      selector: {
        [SortBy[sortby]]: { $gt: 0 },
        "srs.card.state": { $in: Show[show] },
      },
      sort: [{ [SortBy[sortby]]: order }],
      use_index: `${sortby}-index`,
    });
    let payload = response.docs;
    if (response.docs && q != "") {
      const options = {
        keys: ["target", "sentence", "def"],
        includeScore: true,
      };
      const fuse = new Fuse(response.docs, options);
      const searchResult = fuse.search(q);
      payload = searchResult.map((card) => card.item);
    }
    return {
      success: true,
      payload,
    };
  } catch (error) {
    await logError(error);
    throw new Error("Kartu gagal disortir/diurutkan", { cause: error });
  }
}

export async function getCardDoc(cardId) {
  try {
    const cardDoc = await db.get(cardId);
    return {
      success: true,
      payload: cardDoc,
    };
  } catch (error) {
    await logError(error);
    throw new Error("Detail kartu gagal didapatkan", { cause: error });
  }
}

export async function addCardDocs(newCardsData) {
  let responses;
  try {
    const dateCreate = new Date();
    const emptyCard = createEmptyCard(dateCreate);
    const newCardDocs = newCardsData.map((cardDoc) => ({
      _id: `card-${crypto.randomUUID()}`,
      ...cardDoc,
      date_created: dateCreate.toISOString(),
      srs: {
        card: emptyCard,
        log: null,
      },
    }));
    responses = await db.bulkDocs(newCardDocs);
    // .then(() => {
    //   return setMonthlyHistory({ newCountAdd: newCardDocs.length });
    // })
  } catch (error) {
    await logError(error);
    throw new Error("Seluruh kartu gagal ditambahkan", { cause: error });
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
      throw Object.assign(
        new Error("Beberapa kartu gagal ditambahkan", { cause: failMessages }),
        { payload: failResponses },
      );
    }
    return { success: true, message: "Seluruh kartu berhasil ditambahkan" };
  } catch (error) {
    await logError(error);
    throw Object.hasOwn(error, "cause")
      ? error
      : new Error("Beberapa kartu gagal ditambahkan", { cause: error });
  }
}

export async function editCardDoc(cardId, editData) {
  try {
    const { payload: cardDoc } = await getCardDoc(cardId).catch((error) => {
      throw error.cause;
    });
    const editedCardDoc = { ...cardDoc, ...editData };
    await db.put(editedCardDoc);
    return { success: true, message: "Kartu berhasil diubah" };
  } catch (error) {
    await logError(error);
    throw new Error("Kartu gagal diubah", { cause: error });
  }
}

export async function resetCard(cardId) {
  try {
    const f = fsrs();
    const dateNow = new Date();
    const cardDoc = await db.get(cardId);
    const resetSRS = f.forget(cardDoc.srs.card, dateNow, false);
    await editCardDoc(cardId, { srs: resetSRS }).catch((error) => {
      throw error.cause;
    });
    return { success: true, message: "Kartu berhasil direset" };
  } catch (error) {
    await logError(error);
    throw new Error("Kartu gagal direset", { cause: error });
  }
}

export async function deleteCardDoc(cardId) {
  try {
    const cardDoc = await db.get(cardId);
    await db.remove(cardDoc);
    return { success: true, message: "Kartu berhasil dihapus" };
  } catch (error) {
    await logError(error);
    throw new Error("Kartu gagal dihapus", { cause: error });
  }
}

// SORB
export async function getSorbData() {
  try {
    const endToday = getEndTodayUTC();
    await db.createIndex({
      index: {
        fields: ["srs.card.due"],
        ddoc: "srs-card-today-index",
      },
    });
    const response = await db.find({
      selector: {
        "srs.card.due": { $lt: endToday.toISOString() },
      },
      sort: [{ "srs.card.due": "asc" }],
      use_index: "srs-card-today-index",
    });
    const f = fsrs();
    const now = new Date();
    // Get Top Card
    const topCardDoc = response.docs.at(0);
    // Get next review time
    const goodCard =
      topCardDoc && f.next(topCardDoc.srs.card, now, Rating.Good);
    const goodNextTime =
      topCardDoc && msToDHM(goodCard.card.due - goodCard.card.last_review);
    const againCard =
      topCardDoc && f.next(topCardDoc.srs.card, now, Rating.Again);
    const againNextTime =
      topCardDoc && msToDHM(againCard.card.due - againCard.card.last_review);
    // Get cards left
    const todayCardsLeft = Object.groupBy(response.docs, ({ srs }) =>
      srs.card.state == 2 || srs.card.state == 0 ? srs.card.state : 1,
    );
    return {
      success: true,
      payload: {
        topCardDoc,
        nextReview: { good: goodNextTime, again: againNextTime },
        todayCardsLeft: {
          new: todayCardsLeft["0"] ?? [],
          learn: todayCardsLeft["1"] ?? [],
          review: todayCardsLeft["2"] ?? [],
        },
      },
    };
  } catch (error) {
    await logError(error);
    throw new Error("Kartu untuk hari ini gagal didapatkan", { cause: error });
  }
}

export async function updateSRS(cardId, rating) {
  try {
    const f = fsrs();
    const { payload: cardDoc } = await getCardDoc(cardId);
    const updatedSrs = f.next(
      cardDoc.srs.card,
      new Date(),
      rating == 0 ? Rating.Again : Rating.Good,
    );
    await editCardDoc(cardId, { srs: updatedSrs });
    // const scheduledDays = updatedSrs.card.scheduled_days;
    // if (scheduledDays > 0) {
    //   await setMonthlyHistory({reviewCountAdd: 1});
    // }
    return { success: true };
  } catch (error) {
    await logError(error);
    throw new Error("SRS kartu gagal diperbarui", { cause: error });
  }
}

// Accounts
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
    await logError(error);
    throw new Error("Terjadi eror saat mendapatkan file cadangan", {
      cause: error,
    });
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
    await logError(error);
    throw new Error("Seluruh kartu gagal dihapus", { cause: error });
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
      throw new Error("Beberapa kartu gagal dihapus", { cause: failMessages });
    }
    return { success: true, message: "Seluruh kartu berhasil dihapus" };
  } catch (error) {
    await logError(error);
    throw Object.hasOwn(error, "cause")
      ? error
      : new Error("Beberapa kartu gagal dihapus", { cause: error });
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
      abortEarly: true
    })
    if (error) {
      return {
        success: false,
        message: "Struktur file cadangan tidak valid, impor dibatalkan",
      };
    }
    responses = await db.bulkDocs(cardDocs);
  } catch (error) {
    await logError(error);
    throw new Error("Seluruh kartu pada file cadangan gagal diimpor", {
      cause: error,
    });
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
      throw new Error("Beberapa kartu pada file cadangan gagal diimpor", {
        cause: failMessages,
      });
    }
    return {
      success: true,
      message: "Seluruh kartu pada file cadangan berhasil diimpor",
    };
  } catch (error) {
    await logError(error);
    throw Object.hasOwn(error, "cause")
      ? error
      : new Error("Beberapa kartu pada file cadangan gagal diimpor", {
          cause: error,
        });
  }
}

// Home

// export async function getMonthlyHistory() {
//   const startToday = getStartTodayUTC();
//   const defaultHistoryDoc = {
//     _id: "monthly-history",
//     month: startToday.getMonth(),
//   };
//   return db
//     .get("monthly-history")
//     .then((historyDoc) => {
//       return { historyDoc, init: false };
//     })
//     .catch(async (error) => {
//       if (error.name === "not_found") {
//         return { historyDoc: defaultHistoryDoc, init: true };
//       } else {
//         throw error;
//       }
//     })
//     .then(async ({ historyDoc, init }) => {
//       // Reset when month change
//       if (init) {
//         await db.put(defaultHistoryDoc);
//       } else if (historyDoc.month != startToday.getMonth()) {
//         await db.remove(historyDoc);
//         await db.put(defaultHistoryDoc);
//       }
//       return db.get("monthly-history");
//     })
//     .catch((error) => {
//       throw error;
//     });
// }

// async function setMonthlyHistory({ newCountAdd = 0, reviewCountAdd = 0 }) {
//   const todayDate = getStartTodayUTC().getDate().toString();
//   return getMonthlyHistory()
//     .then(async (historyDoc) => {
//       const todayHistory = historyDoc[todayDate];
//       if (todayHistory) {
//         historyDoc[todayDate] = {
//           ...historyDoc[todayDate],
//           newCount: todayHistory.newCount + newCountAdd,
//           reviewCount: todayHistory.reviewCount + reviewCountAdd,
//         };
//       } else {
//         historyDoc[todayDate] = {
//           newCount: newCountAdd,
//           reviewedCount: reviewCountAdd,
//         };
//       }
//       return db.put(historyDoc);
//     })
//     .catch((error) => {
//       throw error;
//     });
// }

// LOG
export async function appendLog(logObject) {
  try {
    const clientLogDoc = await db.get("client-log").catch((error) => {
      if (error.name === "not_found") {
        return { _id: "client-log", log: [] };
      } else {
        throw error;
      }
    });
    console.log(clientLogDoc);
    const clientLog = clientLogDoc["log"];
    const appendedClientLog = [...clientLog, logObject];
    await db.put({ ...clientLogDoc, log: appendedClientLog });
  } catch (error) {
    console.warn("Eror gagal dilog");
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
      await fetch("/api/log/client", {
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
