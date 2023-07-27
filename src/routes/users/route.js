const { Router } = require('express')
const Joi = require('joi')

const withAsyncErrorHandler = require('../../middlewares/async-error')
const { UsersRepository } = require('./repository')
const { validate } = require('../../middlewares/validate')

const router = Router()

const repository = UsersRepository()

/*
  CRUD de usuários
  - C: create
  - R: read (listar + detalhes)
  - U: update
  - D: delete
*/
const NameRegex = /^[A-Z][a-z]+$/
// ************
// ** CREATE **
// ************

// {user:<email>,name:<string>,password:min 5 max 40 <string>}
const createUserSchema = {
  body: Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(5).max(40).required(),
    firstName: Joi.string().regex(NameRegex).required(),
    lastName: Joi.string().regex(NameRegex).required(),
  }),
}
const createUser = async (req, res) => {
  // e se não for um JSON de usuário válido ?
  const user = req.body

  const inserted = await repository.insert(user)
  const location = `/api/users/${inserted.id}`
  res.status(201).header('Location', location).send(inserted)
}

router.post('/', validate(createUserSchema), withAsyncErrorHandler(createUser))

// ************
// ** UPDATE **
// ************
// {name:<string>,password:min 5 max 40 <string>}
const updateUserSchema = {
  params: Joi.object({
    id: Joi.number().required(),
  }),
  body: Joi.object({
    password: Joi.string().min(5).max(40),
    firstName: Joi.string().regex(NameRegex).required(),
    lastName: Joi.string().regex(NameRegex).required(),
  }).or('password', 'fistName', 'lastName'),
}
const updateUser = async (req, res) => {
  const id = parseInt(req.params.id)

  const body = req.body

  const registered = await repository.get(id)

  const user = { ...registered, ...body, id }
  const updated = await repository.update(user)
  res.status(200).send(updated)
}

router.put(
  '/:id',
  validate(updateUserSchema),
  withAsyncErrorHandler(updateUser),
)

// ************
// ** DELETE **
// ************
const deleteUserSchema = {
  params: {
    id: Joi.number().required(),
  },
}
const deleteUser = async (req, res) => {
  // e se for NaN ?
  const id = parseInt(req.params.id)

  await repository.del(id)
  res.status(204).send({ message: 'Deleted' })
}

router.delete(
  '/:id',
  validate(deleteUserSchema),
  withAsyncErrorHandler(deleteUser),
)

// **********
// ** READ **
// **********

const listUsers = async (_req, res) =>
  repository.list().then((users) => res.status(200).send({ users }))

const getUserSchema = {
  params: {
    id: Joi.number().required(),
  },
}
const getUser = async (req, res) => {
  // e se for NaN
  const id = parseInt(req.params.id)

  const user = await repository.get(id)

  res.status(200).send(user)
}

router.get('/', withAsyncErrorHandler(listUsers))
router.get('/:id', validate(getUserSchema), withAsyncErrorHandler(getUser))

module.exports = router
