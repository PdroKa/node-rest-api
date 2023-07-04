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
  message: 'Resource not found',
}

app.get('/todos', (req, res) => {
  todosRepository.list().then((todo) => {
    res.status(200).send(todo)
  })
})

app.get('/todos/:id', (req, res) => {
  const id = req.params.id

  todosRepository.get(id).then((todo) => {
    !todo ? res.status(404).send(notFound) : res.status(200).send(todo)
  })
})

app.post('/todos', async (req, res) => {
  const todo = req.body

  await todosRepository.insert(todo).then((inserted) => {
    res.status(201).header('Location', `/todos/${inserted.id}`).send(inserted)
  })
})

app.put('/todos/:id', async (req, res) => {
  const id = parseInt(req.params.id)
  const todo = { ...req.body, id }

  await todosRepository.get(id).then((idUpdate) => {
    !idUpdate
      ? res.status(404).send(notFound)
      : todosRepository.update(todo).then((idUpdated) => {
          res.status(200).send(idUpdated)
        })
  })
})

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id

  todosRepository.get(id).then((deleted) => {
    !deleted
      ? res.status(404).send(notFound)
      : todosRepository.del(id).then(() => {
          return res.status(204).send()
        })
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
