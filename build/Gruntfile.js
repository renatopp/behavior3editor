module.exports = function(grunt) {

  var files = grunt.file.readJSON('files.json');
  var projectFiles = [];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {separator: ''},
      dist: {src: [], dest: ''}
    },
    uglify: {
      dist: {src: '', dest: ''}
    },
    cssmin: {
      dist: {src  : [], dest : ''}
    },
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // APP AND EDITOR
  grunt.registerTask('_js', function() {
    grunt.config.set('concat.dist.src', files['js']);
    grunt.config.set('concat.dist.dest', '../dist/build.js');
    grunt.config.set('uglify.dist.src', '../dist/build.js');
    grunt.config.set('uglify.dist.dest', '../dist/build.js');
  });
  grunt.registerTask('js', ['_js', 'concat', 'uglify']);

  // LIBS
  grunt.registerTask('_libs', function() {
    grunt.config.set('concat.dist.src', files['libs']);
    grunt.config.set('concat.dist.dest', '../dist/libs.js');
    grunt.config.set('uglify.dist.src', '../dist/libs.js');
    grunt.config.set('uglify.dist.dest', '../dist/libs.js');
  });
  grunt.registerTask('libs', ['_libs', 'concat', 'uglify']);

  // CSS
  grunt.registerTask('_css', function() {
    grunt.config.set('cssmin.dist.src', files['css']);
    grunt.config.set('cssmin.dist.dest', '../dist/build.css');
  });
  grunt.registerTask('css', ['_css', 'cssmin']);

  // TOTAL BUILD
  grunt.registerTask('build', ['js', 'libs', 'css']);
};