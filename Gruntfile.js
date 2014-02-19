module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
        css: {
           src: ['css/*'],
            dest: 'combined.css'
        },
        js : {
            src : ['js/*'],
            dest : 'combined.js'
        }
    },
    cssmin: {
            css: {
                src: 'combined.css',
                dest: 'combined.min.css'
            }
        },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      // define the files to lint
      files: ['gruntfile.js', 'js/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
       // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
           module: true
         }
       }
     },
     watch: {
      files: ['css/*', 'js/*'],
      tasks: ['concat', 'cssmin', 'uglify']
   }
  });


  grunt.loadNpmTasks('grunt-contrib-concat');
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');


  grunt.registerTask('test', ['jshint']
    );

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat:js', 'concat:css', 'uglify']);

};
