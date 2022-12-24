(function () {

  var Cup, getId;

  getId = function(id) {
    return document.getElementById(id);
  };

  Cup = {
    broadcast: function() {},
    
    // TODO

    //Cup.sock.emit 'connection'

    connect: function() {
      var pseudo, pyzza;
      pseudo = getId('pseudo');
      pyzza = getId('pyzza');
      if (pseudo.value !== '' && pyzza.value !== '') {
        Cup.sock.auth = {
          username: pseudo.value,
          pyzza: pyzza.value,
          room: 'cup'
        };
        return Cup.sock.connect();
      }
    },
    init: function() {
      Cup.sock = io(location.host, {
        autoConnect: false
      });
      Cup.sock.on('badconn', () => {
        return console.log('you miss something...');
      });
      Cup.sock.on('broadcast', (evt) => {
        
        console.log('broadcast');
        
        return console.log(evt);
      });
      
      Cup.sock.on('close', () => {
        return console.log('closing');
      });
      Cup.sock.on('connect_error', () => {
        return console.log('oupps!!');
      });
      Cup.sock.on('new_user', (obj) => {
        
        // TODO

        return console.log(`new user: ${obj.username}`);
      });
      
      Cup.sock.onAny((evt, ...args) => {
        
        console.log(evt);
        return console.log(args);
      });
      
      return console.log('starting cup');
    },
    sock: null
  };

  window.Cup = Cup;

})();
