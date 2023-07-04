const express = require('express')
const { TodosRepository } = require('./todos/repository')

const app = express()

app.use(express.json())

app.get('/hello', (request, response) => {
  response.status(200).send('Hello Word!')
})

app.get('/hello/:name', (request, response) => {
  const name = request.params.name
  response.status(200).send('Hello ' + name)
})

//* * TODOS * */
const todosRepository = TodosRepository()

const notFound = {
  error: 'not Found',
  Message: 'Resource not found',
}

app.get('/todos', (req, res) => {
  todosRepository.list().then((todo) => {
    res.status(200).send(todo)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  todosRepository.get(id).then((todo) => {
    if (!todo) {
      return res.status(400).send(notFound)
    }
    res.status(200).send(todo)
  })
})

app.post('/todos', (req, res) => {
  const todo = req.body

  todosRepository.insert(todo).then((inserted) => {
    res.status(201).send(inserted)
  })
})

app
  .listen('3000', '0.0.0.0', () => {
    console.log('👾 Server Started, listening on port 3000 ')
  })
  .once('error', (erro) => {
    console.error(erro)
    process.exit(1)
  })
