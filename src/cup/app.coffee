createElt = (tag, attrs, txt, html) ->
  elt = document.createElement tag
  afn = ([k, v]) -> elt.setAttribute k, v
  afn attr for attr in attrs
  if txt? then elt.innerText = txt
  else if html? then elt.innerHTML = html
  elt

getId = (id) -> document.getElementById id

Cup =
  broadcast: ->
    #
    # TODO
    #
    #Cup.sock.emit 'connection'
    #
  connect: ->
    pseudo = getId 'pseudo'
    pyzza = getId 'pyzza'
    if pseudo.value isnt '' and pyzza.value isnt ''
      Cup.sock.auth = {username: pseudo.value, pyzza: pyzza.value, room: 'cup'}
      Cup.sock.connect()
  init: ->
    Cup.sock = io location.host, {autoConnect: false, reconnect: false}
    Cup.sock.on 'badconn', => console.log 'you miss something...'
    Cup.sock.on 'broadcast', (evt) =>
      #
      console.log 'broadcast'
      #
      console.log evt
      #
    Cup.sock.on 'connect_error', => console.log 'oupps!!'
    Cup.sock.on 'connected', (obj) =>
      Cup.username = obj.username
      #
      #
      #
    Cup.sock.on 'new_user', (obj) =>
      #
      # TODO
      #
      console.log "new user: #{obj.username}"
      #
    Cup.sock.onAny (evt, ...args) =>
      #
      #
      console.log evt
      console.log args
      #
    console.log 'starting cup'
  sock: null
  username: null

window.Cup = Cup

