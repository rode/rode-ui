import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  regoContent: Joi.string().required(),
});

export { schema };
