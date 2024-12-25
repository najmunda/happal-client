import PouchDB from "pouchdb-browser";

const db = new PouchDB('sorbit');
const remoteCouch = false;

export async function getCards() {
  return await db.allDocs({ include_docs: true });
}

export async function addCards(newCards) {
  const dateAdded = new Date().toISOString();
  newCards = newCards.map(card => ({ ...card, dateAdded }));
  return await db.bulkDocs(newCards);
}