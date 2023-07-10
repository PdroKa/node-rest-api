const { Router } = require('express')

const router = Router()

router.get('/', (request, response) => {
  response.status(200).send('Hello Word!')
})

router.get('/:name', (request, response) => {
  const name = request.params.name
  response.status(200).send('Hello ' + name)
})

module.exports = router
