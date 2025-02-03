import PouchDB from "pouchdb-browser";
import plugin from "pouchdb-find";
import { createEmptyCard, fsrs, Rating } from "ts-fsrs";
import { getEndTodayUTC, msToDHM } from "./utils";

PouchDB.plugin(plugin);

const db = new PouchDB('sorbit');
//const remoteCouch = false;

export const adapter = db.adapter;

export async function getCards() {
  return await db.allDocs({
    include_docs: true,
    startkey: "card-",
  });
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
      ddoc: "srs-card-index",
    }
  }).then(async () => {
    const result = await db.find({
      selector: {
        "srs.card.due": { $lt: endToday.toISOString() }
      },
      sort: [{ "srs.card.due": "asc" }],
      use_index: "srs-card-index",
    });
    return result;
  }).then((result) => {
    const f = fsrs();
    const now = new Date();
    const topCard = result.docs.at(0);
    const goodCard = topCard && f.next(topCard.srs.card, now, Rating.Good);
    const goodNextTime = topCard && msToDHM(goodCard.card.due - goodCard.card.last_review);
    const againCard = topCard && f.next(topCard.srs.card, now, Rating.Again);
    const againNextTime = topCard && msToDHM(againCard.card.due - againCard.card.last_review);
    return { docs: result.docs, nextReview: { good: goodNextTime, again: againNextTime } };
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