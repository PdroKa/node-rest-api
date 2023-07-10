const express = require('express')
const hello = require('../src/routes/Hello/route')
const todos = require('../src/routes/todos/route')
const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/error')

const app = express()

app.use(express.json())
app.use(logger())

app.use('/hello', hello)
app.use('/todos', todos)

app.use(errorHandler())

app
  .listen('3000', '0.0.0.0', () => {
    console.log('👾 Server Started, listening on port 3000 ')
  })
  .once('error', (erro) => {
    console.error(erro)
    process.exit(1)
  })
