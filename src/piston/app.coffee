Piston =
  init: ->
    if navigator.serviceWorker isnt null
      navigator.serviceWorker.register '/piston/sw.js', {scope: '/piston/'}

window.Piston = Piston
