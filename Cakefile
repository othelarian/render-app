bach = require 'bach'
coffee = require 'coffeescript'
fse = require 'fs-extra'
{ extname } = require 'path'
pug = require 'pug'
{ rollup, watch } = require 'rollup'
#sass = require 'sass'
sharp = require 'sharp'

# CFG #################################

statapp = {coffee: ['app.coffee', 'app.js'], pug: ['index.pug', 'index.html']}

cfg =
  app: {coffee: ['server.coffee', 'app.js']}
  piston:
    copy: ['sw.js', 'piston.webmanifest']
    icon: ['icon.pug', 'icon.svg']

# ROLLUP PLUGINS ######################

rollCoffee = (opts = {}) =>
  name: 'rolling-coffee'
  transform: (code, id) ->
    if extname(id) != '.coffee' then return null
    out = coffee.compile code, opts
    code: out

# COMMON FUNS #########################

hdlErr = (e, _) -> if e? then console.log "ERROR ======\n\n#{e}"

runExec = (selected, app, cb) ->
  [in_file, out_file] =
    if app isnt 'app' and (selected is 'coffee' or selected is 'pug') then statapp[selected]
    else cfg[app][selected]
  in_file = "src/#{app}/#{in_file}"
  out_file = if app isnt 'app' then "#{app}/#{out_file}" else out_file
  try
    rendered = switch selected
      when 'coffee', 'sw'
        format = if app is 'app' then 'cjs' else 'iife'
        in_opts = {input: in_file, plugins: [rollCoffee {bare: true}]}
        out_opts = {file: out_file, format, strict: false}
        await (await rollup in_opts).write out_opts
        null
      when 'pug', 'icon' then pug.renderFile in_file, cfg
      when 'sass' then throw 'sass not available!'
    if rendered? then fse.writeFileSync out_file, rendered
    if selected is 'icon'
      sh = sharp out_file
      resize = (size) -> await sh.resize(size).toFile "#{app}/icon_#{size}.png"
      resize size for size in [128, 192, 256, 512]
    cb null, 2
  catch e
    console.error "doExec '#{selected}' for #{app} => Something went wrong!!!\n"
    console.log "in_file: #{in_file}\nout_file: #{out_file}\n\n\n"
    cb e, null

# TASKS ###############################

task 'cup', 'build cup', (_) ->
  (bach.parallel cmpJs, cmpPug) hdlErr

task 'cors', 'run test cors server', (_) ->
  cmpJs = (cb) -> runExec 'coffee', 'cors', cb
  cmpPug = (cb) -> runExec 'pug', 'cors', cb
  runServ = (port) ->
    express = require 'express'
    app = express()
    app.use express.static 'cors'
    app.listen port, => console.log "cors server listening on #{port}..."
  serving = bach.parallel ((cb) -> runServ 5000, cb), ((cb) -> runServ 5001, cb)
  (bach.series (bach.parallel cmpJs, cmpPug), serving) hdlErr

task 'piston', 'build piston', (_) ->
  cmpIcon = (cb) -> runExec 'icon', 'piston', cb
  cmpCopy = (cb) ->
    (await fse.copy "src/piston/#{file}", "piston/#{file}") for file in cfg.piston.copy
  cmpJs = (cb) -> runExec 'coffee', 'piston', cb
  cmpPug = (cb) -> runExec 'pug', 'piston', cb
  (bach.parallel cmpIcon, cmpCopy, cmpJs, cmpPug) hdlErr

task 'server', 'build the main server with express and socket.io', (_) ->
  runExec 'coffee', 'app', hdlErr
