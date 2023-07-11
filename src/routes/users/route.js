const { Router } = require('express')
const withAsyncErrorHandler = require('../../middlewares/async-error')

/*
  CRUD de usuários
  - C: create
  - R: read (listar + detalhes)
  - U: update
  - D: delete
*/

const router = Router()

// ************
// ** CREATE **
// ************

const createUser = async (req, res) => {
  res.status(201).header('Location', '/users/IDENTIFICADOR')
}
router.post('/users', withAsyncErrorHandler(createUser))

// ************
// ** UPDATE **
// ************

const updateUser = async (req, res) => {
  res.status(200).send({ user: 'ID Atualizado' })
}

router.put('/:id', withAsyncErrorHandler(updateUser))

// ************
// ** DELETE **
// ************

const deleteUser = async (req, res) => {
  res.status(204).send({ user: 'ID Deletado' })
}

router.delete('/:id', withAsyncErrorHandler(deleteUser))

// ************
// ** READ **
// ************

const listUser = async (_req, res) => {
  res.status(200).send({ users: 'ARRAY DE USUARIOS' })
}

const getUser = async (req, res) => {
  res.status(200).send({ users: 'Usuario do ID' })
}

router.get('/', withAsyncErrorHandler(listUser))
router.get('/:id', withAsyncErrorHandler(getUser))

module.exports = router
