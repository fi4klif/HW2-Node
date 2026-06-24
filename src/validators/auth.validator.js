import { celebrate, Joi, Segments } from "celebrate";

export const registerValidator = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().required().min(3).max(30),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2),
  }),
});

export const loginValidator = celebrate({
  [Segments.BODY]: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
});
