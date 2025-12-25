import { getCardDoc } from "../../db";
import { logError } from "../../utils/logger";

export async function loader({ params }) {
  try {
    const { payload: cardDoc } = await getCardDoc(params.cardId);
    return { error: null, cardDoc };
  } catch (error) {
    await logError(error);
    error.message = Object.hasOwn(error, "cause")
      ? error.message
      : "Detail kartu gagal didapatkan";
    return { error, cardDoc: null };
  }
}
