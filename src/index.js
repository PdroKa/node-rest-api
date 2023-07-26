const express = require('express')

const hello = require('../src/routes/Hello/route')
const todos = require('../src/routes/todos/route')
const users = require('../src/routes/users/route')

const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/error')

const app = express()

const router = express.Router()

router.use(express.json())
router.use(logger())

router.use('/hello', hello)
router.use('/todos', todos)
router.use('/users', users)

router.use(errorHandler())

app.use('/api', router)

app
  .listen('3000', '0.0.0.0', () => {
    console.log('👾 Server Started, listening on port 3000 ')
  })
  .once('error', (erro) => {
    console.error(erro)
    process.exit(1)
  })
