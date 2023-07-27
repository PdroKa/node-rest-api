const Joi = require('joi')
const { ValidationError } = require('../errors')

const validate =
  ({
    body: bodySchema = Joi.any(),
    params: paramsSchema = Joi.any(),
    query: querySchema = Joi.any(),
  }) =>
  (req, _res, next) => {
    const schema = Joi.object({
      body: bodySchema,
      params: paramsSchema,
      query: querySchema,
    })

    const { body, query, params } = req
    const { error } = schema.validate(
      { body, query, params },
      { abortEarly: false },
    )

    if (!error) {
      next()
      return
    }

    next(new ValidationError({ validations: error.details }))
  }

module.exports = {
  validate,
}
