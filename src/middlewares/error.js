const { NotFoundError } = require('../errors')

const responseMaper = {
  [NotFoundError.name]: (error) => ({
    status: 404,
    body: {
      statusCode: 404,
      error: NotFoundError.name,
      message: error.name,
      cause: [],
    },
  }),
  default: (error) => ({
    status: 500,
    body: {
      statusCode: 500,
      error: error.name ?? 'UnexpectedError',
      message: error.message,
      cause: [],
    },
  }),
}

const errorHandler =
  (log = console.error) =>
  (error, _req, res, _next) => {
    log(error)
    const maper = responseMaper[error.name] ?? responseMaper.default
    const { status, body } = maper(error)

    res.status(status).send(body)
  }

module.exports = errorHandler
