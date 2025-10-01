import { createEmptyCard } from "ts-fsrs";
import db, { handleError } from "../../db";

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
    await handleError(error, "Seluruh kartu gagal ditambahkan");
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
      throw Object.assign(new Error(null, { cause: failMessages }), {
        payload: failResponses,
      });
    }
    return { success: true, message: "Seluruh kartu berhasil ditambahkan" };
  } catch (error) {
    await handleError(error, "Beberapa kartu gagal ditambahkan");
  }
}
