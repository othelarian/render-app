
Cors =
  connect: ->
    Cors.result.innerText = 'Waiting...'
    Cors.sock.auth = {username: "corsy#{location.port}", pyzza: 'thisisit', room: 'cors'}
    Cors.sock.connect()
  init: ->
    Cors.result = document.getElementById 'result'
    if io?
      Cors.sock = io 'http://localhost:3001', {autoConnect: false}
      Cors.sock.on 'connect_error', (obj) =>
        console.log 'connection error:'
        console.log obj
        Cors.result.innerText = 'connection error'
      Cors.sock.on 'connected', (obj) =>
        Cors.result.innerText = 'connection OK!'
      Cors.result.innerHTML = '<button onclick="Cors.connect()">Connect</button>'
    else
      Cors.result.innerText = 'IO not reachable'
  result: null
  sock: null

window.Cors = Cors
