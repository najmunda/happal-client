import Joi from "joi";

const cardSchema = Joi.object({
  sentence: Joi.string().trim().required(),
  target: Joi.string().trim().required(),
  def: Joi.string().trim().required(),
  date_created: Joi.string().isoDate().required(),
  srs: Joi.object({
      card: Joi.object({
        due: Joi.string().isoDate().required(),
        stability: Joi.number().required(),
        difficulty: Joi.number().required(),
        elapsed_days: Joi.number().required(),
        scheduled_days: Joi.number().required(),
        reps: Joi.number().required(),
        lapses: Joi.number().required(),
        state: Joi.number().valid(0, 1, 2, 3).required(),
        last_review: Joi.string().isoDate(),
    }).required(),
    log: Joi.object({
      rating: Joi.number().valid(0, 1, 2, 3, 4).required(),
      state: Joi.number().valid(0, 1, 2, 3).required(),
      due: Joi.string().isoDate().required(),
      stability: Joi.number().required(),
      difficulty: Joi.number().required(),
      elapsed_days: Joi.number().required(),
      last_elapsed_days: Joi.number().required(),
      scheduled_days: Joi.number().required(),
      review: Joi.string().isoDate().required(),
    }).allow(null).required(),
  }),
  _id: Joi.string().pattern(/^card-[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/).required(),
});

export function validateCardDoc(card) {
  const { error, value } = cardSchema.validate(card);
  return error ? false : true;
}