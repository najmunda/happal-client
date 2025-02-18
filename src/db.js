import PouchDB from "pouchdb-browser";
import plugin from "pouchdb-find";
import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import { getEndTodayUTC, msToDHM } from "./utils";
import Fuse from "fuse.js";

PouchDB.plugin(plugin);

const db = new PouchDB('sorbit');
//const remoteCouch = false;

export const adapter = db.adapter;

export async function getCardsTotal() {
  return db.allDocs({
    startkey: "card-",
    endkey: 'card-\ufff0',
  }).then((data) => {
    return data.rows.length;
  }).catch((error) => {
    console.log(error);
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

export async function getCardsCustom(options) {
  const q = options['q'] ?? "";
  const show = options['show'] ?? "all";
  const order = options['order'] ?? "desc";
  const sortBy = options['sortby'] ?? "create";
  return db.createIndex({
    index: {
      fields: [SortBy[sortBy], "srs.card.state"],
      ddoc: `${sortBy}-index`,
    }
  }).then(() => {
    return db.find({
      selector: {
        [SortBy[sortBy]]: { $gt: 0 },
        "srs.card.state": { $in: Show[show] },
      },
      sort: [{ [SortBy[sortBy]]: order }],
      use_index: `${sortBy}-index`,
    });
  }).then((data) => {
    if (data.docs && q != "") {
      const options = {
        keys: ['target', 'sentence',  'def'],
        includeScore: true,
      }
      const fuse = new Fuse(data.docs, options);
      const result = fuse.search(q);
      console.log(result);
      return result.map(card => card.item);
    }
    return data.docs;
  }).catch((error) => {
    console.log(error);
  })
}

export async function getCard(cardId) {
  return db.get(cardId).then((card) => {
    return card;
  }).catch((error) => {
    console.log(error);
  })
}

export async function addCards(newCards) {
  const dateCreate = new Date()
  const emptyCard = createEmptyCard(dateCreate);
  newCards = newCards.map(cardData => ({
    _id: `card-${crypto.randomUUID()}`,
    ...cardData,
    date_created: dateCreate.toISOString(),
    srs: {
      card: emptyCard,
      log: null,
    },
  }));
  return await db.bulkDocs(newCards);
}

export async function editCard(cardId, editData) {
  return getCard(cardId).then((card) => {
    return Object.assign(card, { ...editData });
  }).then((editedCard) => {
    return db.put(editedCard);
  }).catch((error) => {
    console.log(error);
  });
}

export async function resetCard(cardId) {
  const f = fsrs();
  const dateNow = new Date()
  return db.get(cardId).then((cardData) => {
    return f.forget(cardData.srs.card, dateNow, false);
  }).then((resetSRS) => {
    return editCard(cardId, { srs: resetSRS });
  }).catch((error) => {
    console.log(error);
  });;
}

export async function deleteCard(cardId) {
  const card = await db.get(cardId);
  return await db.remove(card);
}

// SORB
export async function getTodayCards() {
  const endToday = getEndTodayUTC();
  return db.createIndex({
    index: {
      fields: ['srs.card.due'],
      ddoc: "srs-card-today-index",
    }
  }).then(async () => {
    const result = await db.find({
      selector: {
        "srs.card.due": { $lt: endToday.toISOString() }
      },
      sort: [{ "srs.card.due": "asc" }],
      use_index: "srs-card-today-index",
    });
    return result;
  }).then((result) => {
    const f = fsrs();
    const now = new Date();
    // Get Top Card
    const topCard = result.docs.at(0);
    // Get next review time
    const goodCard = topCard && f.next(topCard.srs.card, now, Rating.Good);
    const goodNextTime = topCard && msToDHM(goodCard.card.due - goodCard.card.last_review);
    const againCard = topCard && f.next(topCard.srs.card, now, Rating.Again);
    const againNextTime = topCard && msToDHM(againCard.card.due - againCard.card.last_review);
    // Get cards left
    const cardsLeft = Object.groupBy(result.docs, ({srs}) => srs.card.state == 2 || srs.card.state == 0 ? srs.card.state : 1 );
    return { 
      topCard, 
      nextReview: { good: goodNextTime, again: againNextTime },
      cardsLeft: {new: cardsLeft['0'] ?? [], learn: cardsLeft['1'] ?? [], review: cardsLeft['2'] ?? []}
    };
  }).catch((error) => {
    console.log(error);
  })
}

export async function updateSRS(cardId, rating) {
  const f = fsrs()
  return getCard(cardId).then((card) => {
    return f.next(card.srs.card, new Date(), rating == 0 ? Rating.Again : Rating.Good);
  }).then((schedulingCard) => {
    return editCard(cardId, { srs: schedulingCard });
  }).catch((error) => {
    console.log(error);
  });
}