fs            = require('fs')
Path          = require('path')
open          = require('open')
Nota          = require('nota')

module.exports = ( grunt ) ->

  grunt.registerMultiTask 'nota', 'Excretes pretty PDF documents', ( ) ->
    nota          = new Nota(Nota.defaults)
    helper        = new Nota.Helper(nota.logging)
    try
      template    = helper.getTemplateDefinition __dirname
    catch
      template = {
        path: __dirname
      }

    job = {
      dataPath:         grunt.option('data')     or definition.exampleData
      outputPath:       grunt.option('output')   or Path.join(__dirname, definition.defaultFilename)
    }

    grunt.log.writeln("=== Nota ===")
    grunt.log.writeln("templatePath:  #{templatePath}")
    grunt.log.writeln("dataPath:      #{dataPath}")
    grunt.log.writeln("outputPath:    #{outputPath}")

    if grunt.options('listen')
      grunt.log.writeln("Starting webrender interface.")
      @nota.start webrender: true
    else
      @nota.start()

    if grunt.option('preview')
      grunt.log.writeln("Opening template in browser.")

      nota.setTemplate template
      nota.setData     dataPath if dataPath?
      open Nota.server.url()

    done = @async()
    nota.queue(job, template).then (meta)->
      done(meta)