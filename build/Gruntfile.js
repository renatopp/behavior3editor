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
    htmlmin: {
      dist: {
        options: {removeComments: true, collapseWhitespace: true},
        src: [], dest: '',
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // APP
  grunt.registerTask('_app', function() {
    grunt.config.set('concat.dist.src', files['app']);
    grunt.config.set('concat.dist.dest', '../dist/build.js');
    grunt.config.set('uglify.dist.src', '../dist/build.js');
    grunt.config.set('uglify.dist.dest', '../dist/build.js');
  });
  grunt.registerTask('app', ['_app', 'concat', 'uglify']);

  // LIBS
  grunt.registerTask('_libs', function() {
    grunt.config.set('concat.dist.src', files['libs']);
    grunt.config.set('concat.dist.dest', '../dist/libs.js');
    grunt.config.set('uglify.dist.src', '../dist/libs.js');
    grunt.config.set('uglify.dist.dest', '../dist/libs.js');
  });
  grunt.registerTask('libs', ['_libs', 'concat', 'uglify']);

  // HTML
  grunt.registerTask('_html', function() {
    grunt.config.set('concat.dist.src', files['html']);
    grunt.config.set('concat.dist.dest', '../dist/build.html');
    grunt.config.set('htmlmin.dist.src', '../dist/build.html');
    grunt.config.set('htmlmin.dist.dest', '../dist/build.html');
  });
  grunt.registerTask('html', ['_html', 'concat', 'htmlmin']);

  // CSS
  grunt.registerTask('_css', function() {
    grunt.config.set('cssmin.dist.src', files['css']);
    grunt.config.set('cssmin.dist.dest', '../dist/build.css');
  });
  grunt.registerTask('css', ['_css', 'cssmin']);

  // TOTAL BUILD
  grunt.registerTask('build', ['app', 'libs', 'css', 'html']);
};