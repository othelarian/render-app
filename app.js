var AUTH_ROOMS, KEY, PORT, app, checkUser, express, i, io, io_conf, len, path, room, room_users, server, whitelist;

express = require('express');

path = require('path');

PORT = process.env.PORT || 3001;

KEY = process.env.KEY || 'thisisit';

AUTH_ROOMS = (process.env.ROOMS || 'cup|cors').split('|');

app = express();

server = require('http').createServer(app);

whitelist = ['http://localhost:5000', 'http://localhost:5001'];

io_conf = {
  cors: {
    origin: function(origin, cb) {
      if (whitelist.includes(origin)) {
        return cb(null, true);
      } else {
        return cb(new Error('CORS not allowed'));
      }
    }
  }
};

io = require('socket.io')(server, io_conf);

room_users = {};

for (i = 0, len = AUTH_ROOMS.length; i < len; i++) {
  room = AUTH_ROOMS[i];
  room_users[room] = {};
}

checkUser = function(room, username, pyzza) {
  return !Object.keys(room_users[room]).includes(username) && pyzza === KEY;
};

io.use((socket, next) => {
  var pyzza, username;
  room = socket.handshake.auth.room;
  if (AUTH_ROOMS.includes(room)) {
    username = socket.handshake.auth.username;
    pyzza = socket.handshake.auth.pyzza;
    if (checkUser(room, username, pyzza)) {
      console.log(`user accepted (${username})`);
      socket.username = username;
      socket.room = room;
      socket.join(room);
      room_users[room][username] = {socket};
      return next();
    } else {
      return next(new Error('invalid identifier'));
    }
  } else {
    return next(new Error('invalid room'));
  }
});

io.on('connection', (client) => {
  io.emit('connected', {
    username: client.username
  });
  io.to(client.room).emit('new_user', {
    username: client.username
  });
  client.on('broadcast', (ld) => {
    
    return console.log(`plop broadcast (user: ${client.username}`);
  });
  
  //client.emit 'broadcast', {type: 'new_user', username: client.username}

  return client.on('disconnect', () => {
    delete room_users[client.room][client.username];
    return console.log(`user in room ${client.room} disconnected: ${client.username}`);
  });
});

app.get('/cup_users', (req, res) => {
  if (room_users.hasOwnProperty('cup')) {
    return res.send(JSON.stringify(Object.keys(room_users.cup)));
  } else {
    return res.send('[]');
  }
});

app.use(express.static(path.join(__dirname, '/')));

server.listen(PORT, () => {
  return console.log(`render-app listening (${PORT})...`);
});
