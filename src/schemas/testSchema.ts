import Joi from "joi";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  pdfUrl: Joi.string().uri().required(),
  categoryName: Joi.string().required(),
  disciplineName: Joi.string().required(),
  teacherName: Joi.string().required(),
});
