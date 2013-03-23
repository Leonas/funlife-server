/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
        dist: {
          src:'core/*/*.js',
          dest: '../trigger_io/src/core.js'
        }
    },

    concat: {
      options: {
        separator: '\n'
      },
      dist: {
        src: ['src/intro.js', 'src/project.js', 'src/outro.js'],
        dest: 'dist/built.js'
      }
    }

  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['uglify', 'concat', 'cssmin']);

};