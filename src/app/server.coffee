express = require 'express'
path = require 'path'

PORT = process.env.PORT || 3001
KEY = process.env.KEY || 'thisisit'
AUTH_ROOMS = (process.env.ROOMS || 'cup|cors').split '|'

app = express()
server = require('http').createServer app

whitelist = ['http://localhost:5000', 'http://localhost:5001']
io_conf =
  cors:
    origin: (origin, cb) ->
      if whitelist.includes origin then cb null, true
      else cb(new Error 'CORS not allowed')
io = require('socket.io') server, io_conf

room_users = {}
room_users[room] = {} for room in AUTH_ROOMS

checkUser = (room, username, pyzza) ->
  not Object.keys(room_users[room]).includes(username) and pyzza is KEY

io.use (socket, next) =>
  room = socket.handshake.auth.room
  if AUTH_ROOMS.includes room
    username = socket.handshake.auth.username
    pyzza = socket.handshake.auth.pyzza
    if checkUser room, username, pyzza
      console.log "user accepted (#{username})"
      socket.username = username
      socket.room = room
      socket.join room
      room_users[room][username] = {socket}
      next()
    else
      next(new Error 'invalid identifier')
  else
    next(new Error 'invalid room')

io.on 'connection', (client) =>
  io.emit 'connected', {username: client.username}
  io.to(client.room).emit 'new_user', {username: client.username}
  client.on 'broadcast', (ld) =>
    #
    console.log "plop broadcast (user: #{client.username}"
    #
    #client.emit 'broadcast', {type: 'new_user', username: client.username}
    #
  client.on 'disconnect', =>
    delete room_users[client.room][client.username]
    console.log "user in room #{client.room} disconnected: #{client.username}"

app.get '/cup_users', (req, res) =>
  if room_users.hasOwnProperty 'cup' then res.send JSON.stringify Object.keys room_users.cup
  else res.send '[]'

app.use express.static path.join __dirname, '/'

server.listen PORT, () => console.log "render-app listening (#{PORT})..."
