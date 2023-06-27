const http =require('http')


const wait = (time) =>
new Promise(resolve =>
  setTimeout(resolve, time)
  )

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
  }

  return {
    insert,
    list,
    get,
    update,
    del,
  }

})()

const server =http.createServer((request,response)=>{
  const jsonHeader={'Content-Type':'application/json'}
//END-POINTs

    /* GET /hello/name */
  if(request.method==='GET' && /^\/hello\/\w+$/.test(request.url)){
    const[,hello,name]=request.url.split('/')
    response.writeHead(200)
    response.end(`Hello ${name}!`)
    return
  }
    /* GET /hello */
  if(request.method === 'GET'&& request.url.startsWith('/hello')){
    response.writeHead(200)
    response.end("Hello Word!")
    return
  }
   /* POST /echo */
  if(request.method==='POST' && request.url.startsWith('/echo')){
    response.writeHead(200)
    request.pipe(response)
    return
  }
  //************* */
  //** API TODOS** */
  //DELETE /todos/:id = Deletar
  //PUT /todos/:id = Atualiar

    //POST /todos = criar
  if(request.method==='POST'&&request.url.startsWith('/todos')){
    let bodyRaw =''

    request.on('data',data=> bodyRaw = data+bodyRaw)

    request.once('end', ()=>{
      const todo= JSON.parse(bodyRaw)

      todosDatabase.insert(todo)
      .then(inserted=>{
        response.writeHead(201,jsonHeader)
        response.end(JSON.stringify(inserted))
      })
    })
    return
  }
    //GET /todos/:id = buscar
  if(request.method==='GET'&&/^\/todos\/\w+$/.test(request.url)){
    const[,todos,id]=request.url.split('/')

    todosDatabase.get(id).then(listId=>{
      response.writeHead(200,jsonHeader)
      response.end(JSON.stringify(listId))
    })
    return
  }
    //GET /todos = listar
  if(request.method==='GET'&&request.url.startsWith('/todos')){
    todosDatabase
    .list()
    .then(todos=>{
      response.writeHead(200,jsonHeader)
      response.end(JSON.stringify(todos))
    })
    return
  }

  response.writeHead(404)
  response.end("Resource not found! 💀")

})

server.listen(3000, '0.0.0.0',()=>{
  console.log('👾 server Started, listening on port 3000')
})
