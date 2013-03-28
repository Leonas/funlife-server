/*global module:false*/
module.exports = function(grunt) {

  var CSS_DIR   = '';
  var JS_DIR    = '';
  var BUILD_DIR = '';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/* <%= pkg.title || pkg.name %> */\n',
    // Task configuration.
    dot: {
      compile: {
        options: {
          variable : 'tmpl',
          root     : '/',
          requirejs: false,
          simple   : true,
          node     : true
        },
        src  : ['4_views/**/*.dot'],
        dest : 'layout/templates.js'
      }
    },
    concat: {
      js: {
        src: ['1_core/**/*.js', '2_models/*.js', '3_controllers/**/*.js', '<%= dot.compile.dest %>', '5_launch/*.js'],
        dest: 'compiled/concat.js'
      },
      css: {
        src: ['layout/css/*.css'],
        dest: 'compiled/all.css'
      }
    },
    strip : {
      main : {
        src : '<%= concat.js.dest %>',
        dest : 'compiled/stripped.js',
        options : {
          nodes : ['console.log', 'debug']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= strip.main.dest %>',
        dest: 'compiled/all.min.js'
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      css: {
        src: '<%= concat.css.dest %>',
        dest: 'compiled/all.min.css'
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'compiled/index.html': 'index.min.html'     // 'destination': 'source'
        }
      }
    },
    copy: {
      compressed: {
        files: [
          {expand: true, flatten: true, src: ['compiled/index.html', 'compiled/all.min.js','compiled/all.min.css'], dest: '../trigger_io/compressed/src/', filter: 'isFile'} // includes files in path
        ]
      },
      uncompressed: {
        files: [
          {src: ['<%= concat.js.src %>', 'layout/css/*.css','index.html'], dest: '../trigger_io/uncompressed/src/', filter: 'isFile'} // includes files in path
        ]
      }
    },
    watch: {
      slow: {
        files: '<%= concat.js.src %>',
        tasks: ['default']
      },
      quick: {
        files: '<%= concat.js.src %>',
        tasks: ['quick']
      }
//      ,
//      templates: {
//        files: '<%= dot.compile.src %>',
//        tasks: ['dot']
//      }
    }
  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-dot-compiler');
  grunt.loadNpmTasks('grunt-strip');

  grunt.registerTask('default', [ 'dot', 'concat', 'strip', 'uglify', 'cssmin', 'htmlmin', 'copy',  'watch.slow']);
  grunt.registerTask('quick', [ 'dot', 'copy',  'watch']);
};