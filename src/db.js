import PouchDB from "pouchdb-browser";

const db = new PouchDB('sorbit');
const remoteCouch = false;

export async function getCards() {
  return await db.allDocs({ include_docs: true });
}

export async function getCard(cardId) {
  return await db.get(cardId);
}

export async function addCards(newCards) {
  const dateAdded = new Date().toISOString();
  newCards = newCards.map(card => ({ ...card, dateUpdated: dateAdded }));
  return await db.bulkDocs(newCards);
}

export async function editCard(cardId, editData) {
  const dateEdited = new Date().toISOString();
  const card = await getCard(cardId);
  Object.assign(editData, { _id: cardId, _rev: card._rev, dateUpdated: dateEdited });
  const result = await db.put(editData);
  return result;
}

export async function deleteCard(cardId) {
  const card = await db.get(cardId);
  return await db.remove(card);
}