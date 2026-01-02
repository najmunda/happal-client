import { fsrs, Rating } from "ts-fsrs";
import db, { editCardDoc, getCardDoc, handleError } from "../../db";
import { getEndTodayUTC, msToDHM } from "../../utils/utils";

export async function getSorbData(cardDocsTotal) {
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
      limit: cardDocsTotal,
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
    await handleError(error, "Kartu untuk direview gagal didapatkan");
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
    return { success: true };
  } catch (error) {
    await handleError(error, "SRS kartu gagal diperbarui");
  }
}

export async function undoSRS(prevCardId, prevCardRev) {
  try {
    const options = { rev: prevCardRev };
    const {
      payload: { srs: prevSrs },
    } = await getCardDoc(prevCardId, options);
    await editCardDoc(prevCardId, { srs: prevSrs });
    return { success: true };
  } catch (error) {
    await handleError(error, "Penilaian gagal diurungkan");
  }
}
