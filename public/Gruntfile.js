///*global module:false*/
//module.exports = function(grunt) {
//
//  // Project configuration.
//  grunt.initConfig({
//    pkg: grunt.file.readJSON('package.json'),
//
//    uglify: {
//        trigger_io: {
//          src:['1_core/*/*.js', '2_models/*.js', '3_controllers/*/*.js'],
//          dest: '../trigger_io/src/core.js'
//        },
//        local: {
//        src:['1_core/*/*.js', '2_models/*.js', '3_controllers/*/*.js'],
//        dest: 'core.js'
//      }
//    }
////    ,
//
////    concat: {
////      options: {
////        separator: '\n'
////      },
////      dist: {
////        src: ['core/*/*.js'],
////        dest: 'dist/built.js'
////      }
////    },
////
//    cssmin: {
//      compress: {
//        files: {
//          'path/to/output.css': ['path/to/input_one.css', 'path/to/input_two.css']
//        }
//      },
//      with_banner: {
//        options: {
//          banner: '/* My minified css file */'
//        },
//        files: {
//          'path/to/output.css': ['path/to/**/*.css']
//        }
//      }
//    }
//
//
//  });
//  grunt.loadNpmTasks('grunt-contrib-uglify');
//  grunt.loadNpmTasks('grunt-contrib-concat');
//  grunt.loadNpmTasks('grunt-contrib-cssmin');
//  grunt.registerTask('default', ['uglify']);
//
//};
//

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
    concat: {
      js: {
        src: ['1_core/*/*.js', '2_models/*.js', '3_controllers/*/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
      css: {
        src: ['layout/css/*.css'],
        dest: 'dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.js.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      css: {
        src: '<%= concat.css.dest %>',
        dest: 'dist/<%= pkg.name %>.min.css'
      }
    },
    dot: {
      dist: {
        options: {
          variable : 'tmpl',
          root     : '/',
          requirejs: false,
          node     : false
        },
        src  : ['4_views/**/*.dot'],
        dest : 'dist/templates.js'
      }
    },
//    qunit: {
//      files: ['test/*.html']
//    },
    watch: {
      gruntfile: {
        files: '<%= concat.dist.src %>',
        tasks: ['default']
      }
//      ,
//      lib_test: {
//        files: '<%= jshint.lib_test.src %>',
//        tasks: ['jshint:lib_test', 'qunit']
//      }
    }
  });

  // Default task.
  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-dot-compiler');

  grunt.registerTask('default', [ 'concat', 'uglify', 'cssmin', 'dot']);

};