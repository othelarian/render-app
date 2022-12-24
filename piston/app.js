(function () {

  var Piston;

  Piston = {
    init: function() {
      if (navigator.serviceWorker !== null) {
        return navigator.serviceWorker.register('/piston/sw.js', {
          scope: '/piston/'
        });
      }
    }
  };

  window.Piston = Piston;

})();
