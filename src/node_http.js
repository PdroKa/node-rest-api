const http = require('http')

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time))
const todosDatabase = (() => {
  let idSequence = 1
  const todos = {}

  const insert = async (todo) => {
    await wait(500)
    const id = idSequence++
    const data = { ...todo, id }
    todos[id] = data
    return data
  }

  const list = async () => {
    await wait(100)
    return Object.values(todos)
  }

  const get = async (id) => {
    await wait(100)
    return todos[id]
  }

  const update = async (todo) => {
    await wait(500)
    todos[todo.id] = todo
    return todo
  }

  const del = async (id) => {
    await wait(500)
    delete todos[id]
    return todos
  }

  return {
    insert,
    list,
    get,
    update,
    del,
  }
})()

const server = http.createServer((request, response) => {
  const jsonHeader = { 'Content-Type': 'application/json' }
  // END-POINTs

  /* GET /hello/name */
  if (request.method === 'GET' && /^\/hello\/\w+$/.test(request.url)) {
    const [, , name] = request.url.split('/')
    response.writeHead(200)
    response.end(`Hello ${name}!`)
    return
  }
  /* GET /hello */
  if (request.method === 'GET' && request.url.startsWith('/hello')) {
    response.writeHead(200)
    response.end('Hello Word!')
    return
  }
  /* POST /echo */
  if (request.method === 'POST' && request.url.startsWith('/echo')) {
    response.writeHead(200)
    request.pipe(response)
    return
  }
  //* ************ */
  //* * API TODOS** */

  // POST /todos = criar
  if (request.method === 'POST' && request.url.startsWith('/todos')) {
    let bodyRaw = ''

    request.on('data', (data) => (bodyRaw = data + bodyRaw))

    request.once('end', () => {
      const todo = JSON.parse(bodyRaw)

      todosDatabase.insert(todo).then((inserted) => {
        response.writeHead(201, jsonHeader)
        response.end(JSON.stringify(inserted))
      })
    })
    return
  }

  // PUT /todos/:id = Atualiar
  if (request.method === 'PUT' && /^\/todos\/\d+$/.test(request.url)) {
    let bodyRaw = ''

    const [, , idRaw] = request.url.split('/')
    const id = parseInt(idRaw)

    request.on('data', (data) => (bodyRaw += data))

    request.once('end', () => {
      const todo = { ...JSON.parse(bodyRaw), id }

      todosDatabase.update(todo).then((update) => {
        response.writeHead(200, jsonHeader)
        response.end(JSON.stringify(update))
      })
    })
    return
  }

  // GET /todos/:id = buscar
  if (request.method === 'GET' && /^\/todos\/\d+$/.test(request.url)) {
    const [, , idRaw] = request.url.split('/')
    const id = parseInt(idRaw)

    todosDatabase.get(id).then((listId) => {
      if (!listId) {
        response.writeHead(404, jsonHeader)
        response.end({ message: 'Resource not found' })
      } else {
        response.writeHead(200, jsonHeader)
        response.end(JSON.stringify(listId))
      }
    })
    return
  }
  // GET /todos = listar
  if (request.method === 'GET' && request.url.startsWith('/todos')) {
    todosDatabase.list().then((todos) => {
      response.writeHead(200, jsonHeader)
      response.end(JSON.stringify(todos))
    })
    return
  }
  // DELETE /todos/:id = Deletar
  if (request.method === 'DELETE' && /^\/todos\/\w+$/.test(request.url)) {
    const [, , id] = request.url.split('/')

    todosDatabase.del(id).then((todos) => {
      response.writeHead(204, jsonHeader)
      response.end(JSON.stringify(todos))
    })
    return
  }

  response.writeHead(404)
  response.end('Resource not found! 💀')
})

server.listen(3000, '0.0.0.0', () => {
  console.log('👾 server Started, listening on port 3000')
})
