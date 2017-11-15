module.exports = function(grunt) {

  var path = require('path'),
      fs = require('fs'),
      shell = require('shelljs');
  grunt.loadNpmTasks('grunt-docco');

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var MODULE_NAME = 'rrule';
  var SRC_DIR = 'src';
  var DOCS_DIR = 'docs';
  var TESTS_DIR = 'tests/nodejs';

  // Define the configuration for all the tasks.
  grunt.initConfig({
    docco: {
      debug: {
        src: ['src/**/*.coffee'],
        options: {
          output: DOCS_DIR
        }
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'coffee-script/register'
        },
        src: [TESTS_DIR + '/**/*Spec.coffee']
      }
    }
  });

  grunt.registerTask('test', 'Runs tests.', function (arg1) {
    if (arg1 === undefined) {
      grunt.task.run('mochaTest');
    } else {
      shell.exec('mocha --reporter spec --require coffee-script/register ' +
          path.join(TESTS_DIR, arg1));
    }
  });

  grunt.registerTask('docs', 'Compiles docs with Docco.', function() {
    grunt.task.run('docco');
  });

  grunt.registerTask('test:ci', 'Runs tests.', ['mochaTest']);

  // FILES

  function readFile(file) {
    return fs.readFileSync(file, {encoding: 'utf-8'});
  }

  function writeFile(file, data) {
    if (typeof data === 'function') {
      data = data(readFile(file));
    }
    fs.writeFileSync(file, data);
  }

  function _prefixPath(dir, args) {
    var prefixedArgs = Array.prototype.slice.apply(args);
    prefixedArgs.unshift(dir);
    return path.join.apply(path, prefixedArgs);
  }

  function srcPath() {
    return _prefixPath(SRC_DIR, arguments);
  }

};
