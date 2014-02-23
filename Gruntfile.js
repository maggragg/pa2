module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files: [
          // includes files within path
          {expand: true, src: ['views/*.html'], dest: 'dist/'},
          {expand: true, src: ['css/*.css'], dest: 'dist/'},
          {expand: true, src: ['*.html'], dest: 'dist/'},
          {expand: true, src: ['bower_components/**'], dest: 'dist/'}
        ]
      }
    },
    concat: {
        css: {
           src: ['css/*'],
            dest: 'css/combined.css'
        },
        js : {
            src : ['js/*'],
            dest : 'dist/js/chatclient.js'
        }
    },
    cssmin: {
            css: {
                src: 'css/combined.css',
                dest: 'dist/css/style.min.css'
            }
        },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/js/chatclient.js',
        //src: 'src/<%= pkg.name %>.js',
        dest: 'dist/js/chatclient.min.js'
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
      files: ['css/*', 'js/*', '*.html'],
      tasks: ['concat', 'uglify', 'copy']

   },
   connect: {
    server: {
      options: {
        port: 8000,
        base: 'dist',
        liveroload: 'true',
        keepalive: 'true',
        open: 'true'
      }
    }
  }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');


  grunt.registerTask('test', ['jshint']
    );

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat:js', 'uglify', 'copy']);

};
