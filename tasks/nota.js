(function() {
  var Nota, Path, fs, open;

  fs = require('fs');

  Path = require('path');

  open = require('open');

  Nota = require('nota');

  module.exports = function(grunt) {
    return grunt.registerMultiTask('nota', 'Excretes pretty PDF documents', function() {
      var done, helper, job, nota, template;
      nota = new Nota(Nota.defaults);
      helper = new Nota.Helper(nota.logging);
      try {
        template = helper.getTemplateDefinition(__dirname);
      } catch (_error) {
        template = {
          path: __dirname
        };
      }
      job = {
        dataPath: grunt.option('data') || definition.exampleData,
        outputPath: grunt.option('output') || Path.join(__dirname, definition.defaultFilename)
      };
      grunt.log.writeln("=== Nota ===");
      grunt.log.writeln("templatePath:  " + templatePath);
      grunt.log.writeln("dataPath:      " + dataPath);
      grunt.log.writeln("outputPath:    " + outputPath);
      if (grunt.options('listen')) {
        grunt.log.writeln("Starting webrender interface.");
        this.nota.start({
          webrender: true
        });
      } else {
        this.nota.start();
      }
      if (grunt.option('preview')) {
        grunt.log.writeln("Opening template in browser.");
        nota.setTemplate(template);
        if (typeof dataPath !== "undefined" && dataPath !== null) {
          nota.setData(dataPath);
        }
        open(Nota.server.url());
      }
      done = this.async();
      return nota.queue(job, template).then(function(meta) {
        return done(meta);
      });
    });
  };

}).call(this);
