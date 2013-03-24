/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
        trigger_io: {
          src:['1_core/*/*.js', '2_models/*.js', '3_controllers/*/*.js'],
          dest: '../trigger_io/src/core.js'
        },
        local: {
        src:['1_core/*/*.js', '2_models/*.js', '3_controllers/*/*.js'],
        dest: 'core.js'
      }
    }
//    ,

//    concat: {
//      options: {
//        separator: '\n'
//      },
//      dist: {
//        src: ['core/*/*.js'],
//        dest: 'dist/built.js'
//      }
//    },
//
//    cssmin: {
//
//    }


  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['uglify']);

};