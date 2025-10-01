import PouchDB from "pouchdb-browser";
import findPlugin from "pouchdb-find";
import upsertPlugin from "pouchdb-upsert";
import { logError } from "./utils/logger";
import { safeFetch } from "./utils/utils";

export async function handleError(error, message) {
  error.message = error?.message ?? message;
  const loggedError = await logError(error);
  throw new Error(message, { cause: loggedError });
}

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

export default db;

export async function syncDB() {
  try {
    const remoteDb = new PouchDB(`${import.meta.env.VITE_SERVER_URL}/db`, {
      fetch: function (url, opts) {
        opts.credentials = "include";
        return PouchDB.fetch(url, opts);
      },
      skip_setup: true,
    });
    await new Promise((resolve, reject) => {
      db.sync(remoteDb, {
        style: "main_only",
        push: {
          filter: (doc) => doc._id.startsWith("card-"),
        },
      })
        .on("complete", (info) => {
          safeFetch(`${import.meta.env.VITE_SERVER_URL}/user/last-sync`, {
            method: "POST",
            credentials: "include",
          })
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
    await handleError(error, "Terjadi eror saat sinkronisasi");
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
    await handleError(error, "Detail user gagal didapatkan");
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
    await handleError(error, "Detail user gagal diperbarui");
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
    await handleError(error, "Jumlah kartu gagal didapatkan");
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
    await handleError(error, "Detail kartu gagal didapatkan");
  }
}

export async function editCardDoc(cardId, editData) {
  try {
    const { payload: cardDoc } = await getCardDoc(cardId);
    const editedCardDoc = { ...cardDoc, ...editData };
    await db.put(editedCardDoc);
    return { success: true, message: "Kartu berhasil diubah" };
  } catch (error) {
    await handleError(error, "Kartu gagal diubah");
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
    const clientLog = clientLogDoc["log"];
    const appendedClientLog = [...clientLog, logObject];
    await db.put({ ...clientLogDoc, log: appendedClientLog });
  } catch (error) {
    console.warn("Eror gagal dilog");
  }
}
