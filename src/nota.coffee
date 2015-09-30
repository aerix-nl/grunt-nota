fs            = require('fs')
Path          = require('path')
open          = require('open')
Nota          = require('nota')

module.exports = ( grunt ) ->

  grunt.registerMultiTask 'nota', 'Excretes pretty PDF documents', ( ) ->
    nota          = new Nota Nota.defaults, new Nota.LoggingChannels()
    helper        = new Nota.TemplateHelper(nota.logging)
    templatePath  = Path.resolve(__dirname, '../../..')
    try
      template    = helper.getTemplateDefinition '/Users/felix/Aerix/Repositories/Nota-cli/templates/example-invoice/' # templatePath
    catch
      template = {
        path: templatePath
      }

    console.log @

    job = {
      dataPath:         grunt.option('data')     or template.exampleData
      outputPath:       grunt.option('output')   or Path.join(templatePath, template.defaultFilename)
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