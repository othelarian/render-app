(function () {

  var Cors;

  Cors = {
    connect: function() {
      Cors.result.innerText = 'Waiting...';
      Cors.sock.auth = {
        username: `corsy${location.port}`,
        pyzza: 'thisisit',
        room: 'cors'
      };
      return Cors.sock.connect();
    },
    init: function() {
      Cors.result = document.getElementById('result');
      if (typeof io !== "undefined" && io !== null) {
        Cors.sock = io('http://localhost:3001', {
          autoConnect: false
        });
        Cors.sock.on('connect_error', (obj) => {
          console.log('connection error:');
          console.log(obj);
          return Cors.result.innerText = 'connection error';
        });
        Cors.sock.on('connected', (obj) => {
          return Cors.result.innerText = 'connection OK!';
        });
        return Cors.result.innerHTML = '<button onclick="Cors.connect()">Connect</button>';
      } else {
        return Cors.result.innerText = 'IO not reachable';
      }
    },
    result: null,
    sock: null
  };

  window.Cors = Cors;

})();
