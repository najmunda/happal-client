import PouchDB from "pouchdb-browser";
import findPlugin from "pouchdb-find";
import upsertPlugin from "pouchdb-upsert";
import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import { getEndTodayUTC, getStartTodayUTC, msToDHM } from "./utils";
import Fuse from "fuse.js";

PouchDB.plugin(findPlugin);
PouchDB.plugin(upsertPlugin);

const db = new PouchDB('sorbit', {
  auto_compaction: true,
  revs_limit: 500,
});

export async function syncDB() {
  const remoteDb = new PouchDB(`${location.origin}/api/db`, {
    skip_setup: true,
  });

  return new Promise((resolve, reject) => {
    db.sync(remoteDb, {
      style: 'main_only',
      filter: doc => doc._id.startsWith("card-"),
    }).on('complete', (info) => {
      fetch('/api/user/last-sync', {method: 'POST',}).then(() => {
        resolve(info);
      }).catch(error => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// cardDoc = document with id card-* stored in pouchdb
// card = object inside CardDoc (cardDoc.srs.card)
// response = response from pouchdb api (db.put, db.remove, etc.)

export async function getCardsTotal() {
  return db.allDocs({
    startkey: "card-",
    endkey: 'card-\ufff0',
  }).then((response) => {
    return response.rows.length;
  }).catch((error) => {
    throw error;
  });
}

const SortBy = Object.freeze({
  create: 'date_created',
  due: 'srs.card.due',
  review: 'srs.card.last_review',
});

const Show = Object.freeze({
  all: [0, 1, 2, 3],
  new: [0],
  learn: [1, 3],
  review: [2],
});

export async function getCardsCustom({q = "", show = "all", order = "desc", sortby = "create"} = {}) {
  return db.createIndex({
    index: {
      fields: [SortBy[sortby], "srs.card.state"],
      ddoc: `${sortby}-index`,
    }
  }).then(() => {
    return db.find({
      selector: {
        [SortBy[sortby]]: { $gt: 0 },
        "srs.card.state": { $in: Show[show] },
      },
      sort: [{ [SortBy[sortby]]: order }],
      use_index: `${sortby}-index`,
    });
  }).then((response) => {
    if (response.docs && q != "") {
      const options = {
        keys: ['target', 'sentence',  'def'],
        includeScore: true,
      }
      const fuse = new Fuse(response.docs, options);
      const searchResult = fuse.search(q);
      return searchResult.map(card => card.item);
    }
    return response.docs;
  }).catch((error) => {
    throw error;
  })
}

export async function getCardDoc(cardId) {
  return db.get(cardId).then((cardDoc) => {
    return cardDoc;
  }).catch((error) => {
    throw error;
  })
}

export async function addCardDocs(newCardDocs) {
  const dateCreate = new Date()
  const emptyCard = createEmptyCard(dateCreate);
  newCardDocs = newCardDocs.map(cardDoc => ({
    _id: `card-${crypto.randomUUID()}`,
    ...cardDoc,
    date_created: dateCreate.toISOString(),
    srs: {
      card: emptyCard,
      log: null,
    },
  }));
  return db.bulkDocs(newCardDocs).then(() => {
    return setMonthlyHistory({newCountAdd: newCardDocs.length})
  }).catch((error) => {
    throw error;
  });
}

export async function editCardDoc(cardId, editData) {
  return getCardDoc(cardId).then((cardDoc) => {
    return Object.assign(cardDoc, { ...editData });
  }).then((editedCardDoc) => {
    return db.put(editedCardDoc);
  }).catch((error) => {
    throw error;
  });
}

export async function resetCard(cardId) {
  const f = fsrs();
  const dateNow = new Date()
  return db.get(cardId).then((cardDoc) => {
    return f.forget(cardDoc.srs.card, dateNow, false);
  }).then((resetSRS) => {
    return editCardDoc(cardId, { srs: resetSRS });
  }).catch((error) => {
    throw error;
  });
}

export async function deleteCardDoc(cardId) {
  return db.get(cardId).then(cardDoc => {
    return db.remove(cardDoc);
  }).catch((error) => {
    throw error;
  });
}

// SORB
export async function getTodayCards() {
  const endToday = getEndTodayUTC();
  return db.createIndex({
    index: {
      fields: ['srs.card.due'],
      ddoc: "srs-card-today-index",
    }
  }).then(() => {
    return db.find({
      selector: {
        "srs.card.due": { $lt: endToday.toISOString() }
      },
      sort: [{ "srs.card.due": "asc" }],
      use_index: "srs-card-today-index",
    });
  }).then((response) => {
    const f = fsrs();
    const now = new Date();
    // Get Top Card
    const topCardDoc = response.docs.at(0);
    // Get next review time
    const goodCard = topCardDoc && f.next(topCardDoc.srs.card, now, Rating.Good);
    const goodNextTime = topCardDoc && msToDHM(goodCard.card.due - goodCard.card.last_review);
    const againCard = topCardDoc && f.next(topCardDoc.srs.card, now, Rating.Again);
    const againNextTime = topCardDoc && msToDHM(againCard.card.due - againCard.card.last_review);
    // Get cards left
    const cardsLeft = Object.groupBy(response.docs, ({srs}) => srs.card.state == 2 || srs.card.state == 0 ? srs.card.state : 1 );
    return { 
      topCardDoc, 
      nextReview: { good: goodNextTime, again: againNextTime },
      cardsLeft: {new: cardsLeft['0'] ?? [], learn: cardsLeft['1'] ?? [], review: cardsLeft['2'] ?? []}
    };
  }).catch((error) => {
    throw error;
  })
}

export async function updateSRS(cardId, rating) {
  const f = fsrs()
  return getCardDoc(cardId).then((cardDoc) => {
    return f.next(cardDoc.srs.card, new Date(), rating == 0 ? Rating.Again : Rating.Good);
  }).then(async (schedulingCard) => {
    return editCardDoc(cardId, { srs: schedulingCard }).then(async response => {
      const scheduledDays = schedulingCard.card.scheduled_days;
      if (scheduledDays > 0) {
        await setMonthlyHistory({reviewCountAdd: 1});
      }
      return response;
    }).catch(error => {
      throw error;
    });
  }).catch((error) => {
    throw error;
  });
}

// Accounts
export async function downloadAllCards() {
  return getCardsCustom().then(cardDocs => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const blob = new Blob([JSON.stringify(cardDocs)], {type: "text/json"});
    const link = document.createElement('a');
    link.download = `${year}${month}${day}-happal.json`;
    link.href = window.URL.createObjectURL(blob);
    link.dataset.downloadurl = ["text/json", link.download, link.href].join(":");
    link.dispatchEvent(new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    }));
    link.remove();
  }).catch((error) => {
    throw error;
  });
}

export async function deleteAllCards() {
  return db.allDocs({
    include_docs: true,
    startkey: "card-",
    endkey: 'card-\ufff0',
  }).then((response) => {
    const deletedCardsDoc = response.rows.map(cardDoc => ({...cardDoc.doc, _deleted: true}));
    return db.bulkDocs(deletedCardsDoc);
  }).catch((error) => {
    throw error;
  });
}

// Home

export async function getMonthlyHistory() {
  const startToday = getStartTodayUTC();
  const defaultHistoryDoc = {
    _id: 'monthly-history',
    month: startToday.getMonth(),
  };
  return db.get('monthly-history').then(historyDoc => {
    return {historyDoc, init: false};
  }).catch(async (error) => {
    if (error.name === 'not_found') {
      return {historyDoc: defaultHistoryDoc, init: true};
    } else {
      throw error;
    }
  }).then(async ({historyDoc, init}) => {
    // Reset when month change
    if (init) {
      await db.put(defaultHistoryDoc);
    } else if (historyDoc.month != startToday.getMonth()) {
      await db.remove(historyDoc);
      await db.put(defaultHistoryDoc);
    }
    return db.get('monthly-history');
  }).catch((error) => {
    throw error;
  });
}

async function setMonthlyHistory({newCountAdd = 0, reviewCountAdd = 0}) {
  const todayDate = getStartTodayUTC().getDate().toString();
  return getMonthlyHistory().then(async (historyDoc) => {
    const todayHistory = historyDoc[todayDate];
    if (todayHistory) {
      historyDoc[todayDate] = {...historyDoc[todayDate], newCount: todayHistory.newCount + newCountAdd, reviewCount: todayHistory.reviewCount + reviewCountAdd};
    } else {
      historyDoc[todayDate] = {newCount: newCountAdd, reviewedCount: reviewCountAdd};
    }
    return db.put(historyDoc);
  }).catch((error) => {
    throw error;
  });
}