const { Router } = require('express')
const { TodosRepository } = require('./repository')

const router = Router()

const todosRepository = TodosRepository()

const notFound = {
  error: 'not Found',
  message: 'Resource not found',
}

router.get('/', (_req, res) => {
  todosRepository.list().then((todo) => {
    res.status(200).send(todo)
  })
})

router.get('/:id', (req, res) => {
  const id = req.params.id

  todosRepository.get(id).then((todo) => {
    !todo ? res.status(404).send(notFound) : res.status(200).send(todo)
  })
})

router.post('/', async (req, res) => {
  const todo = req.body

  await todosRepository.insert(todo).then((inserted) => {
    res.status(201).header('Location', `/todos/${inserted.id}`).send(inserted)
  })
})

router.put('/:id', async (req, res) => {
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

router.delete('/:id', (req, res) => {
  const id = req.params.id

  todosRepository.get(id).then((deleted) => {
    !deleted
      ? res.status(404).send(notFound)
      : todosRepository.del(id).then(() => {
          return res.status(204).send()
        })
  })
})

module.exports = router
