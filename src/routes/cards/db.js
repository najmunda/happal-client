import Fuse from "fuse.js";
import db, { editCardDoc, handleError } from "../../db";
import { fsrs } from "ts-fsrs";

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

export async function getCardsCustom(
  { q = "", show = [], order = "desc", sortby = "create", page = "1" } = {},
  cardDocsTotal,
) {
  try {
    page = Number.parseInt(page);
    const maxCardShowed = 24;

    // Create index
    await db.createIndex({
      index: {
        fields: [SortBy[sortby], "srs.card.state"],
        ddoc: `${sortby}-index`,
      },
    });
    // Set object parameter for db.find
    const findObjParam = {
      selector: {
        [SortBy[sortby]]: { $gt: 0 },
      },
      use_index: `${sortby}-index`,
      limit: cardDocsTotal,
    };
    if (show?.length) {
      show = show.reduce((result, item) => [...result, ...Show[item]], []);
      findObjParam.selector["srs.card.state"] = { $in: show };
    }
    if (q === "") {
      findObjParam["sort"] = [{ [SortBy[sortby]]: order }];
      findObjParam["limit"] = maxCardShowed + 1;
      if (page > 1) {
        findObjParam["skip"] = maxCardShowed * (page - 1);
      }
    }

    const response = await db.find(findObjParam);
    let payload = { cardDocs: [], isLastPage: true };
    if (response.docs.length && q === "") {
      payload = {
        cardDocs: response.docs.toSpliced(maxCardShowed, 1),
        isLastPage: response.docs.length <= maxCardShowed,
      };
    } else if (response.docs.length && q !== "") {
      const options = {
        keys: ["target", "sentence", "def"],
        includeScore: true,
      };
      const fuse = new Fuse(response.docs, options);
      const searchResult = fuse.search(q);
      const startIndex = maxCardShowed * (page - 1);
      const cardDocs = searchResult
        .slice(startIndex, startIndex + maxCardShowed + 1)
        .map((card) => card.item);
      payload = {
        cardDocs: cardDocs.toSpliced(maxCardShowed, 1),
        isLastPage: cardDocs.length <= maxCardShowed,
      };
    }
    return {
      success: true,
      payload,
    };
  } catch (error) {
    await handleError(error, "Kartu gagal didapatkan");
  }
}

export async function resetCard(cardId) {
  try {
    const f = fsrs();
    const dateNow = new Date();
    const cardDoc = await db.get(cardId);
    const resetSRS = f.forget(cardDoc.srs.card, dateNow, false);
    await editCardDoc(cardId, { srs: resetSRS });
    return { success: true, message: "Kartu berhasil direset" };
  } catch (error) {
    await handleError(error, "Kartu gagal direset");
  }
}

export async function deleteCardDoc(cardId) {
  try {
    const cardDoc = await db.get(cardId);
    await db.remove(cardDoc);
    return { success: true, message: "Kartu berhasil dihapus" };
  } catch (error) {
    await handleError(error, "Kartu gagal dihapus");
  }
}
