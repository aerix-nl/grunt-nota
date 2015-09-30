(function() {
  var Nota, Path, fs, open;

  fs = require('fs');

  Path = require('path');

  open = require('open');

  Nota = require('nota');

  module.exports = function(grunt) {
    return grunt.registerMultiTask('nota', 'Excretes pretty PDF documents', function() {
      var done, helper, job, nota, template, templatePath;
      nota = new Nota(Nota.defaults, new Nota.LoggingChannels());
      helper = new Nota.TemplateHelper(nota.logging);
      templatePath = Path.resolve(__dirname, '../../..');
      try {
        template = helper.getTemplateDefinition('/Users/felix/Aerix/Repositories/Nota-cli/templates/example-invoice/');
      } catch (_error) {
        template = {
          path: templatePath
        };
      }
      console.log(this);
      job = {
        dataPath: grunt.option('data') || template.exampleData,
        outputPath: grunt.option('output') || Path.join(templatePath, template.defaultFilename)
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
