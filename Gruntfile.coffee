module.exports = (grunt) ->

  # grunt.loadNpmTasks "grunt-express-server"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-sass"
  grunt.loadNpmTasks "grunt-contrib-cssmin"

  grunt.config.init

    # express:
    #   dev:
    #     options:
    #       script: "server.js"

    watch:
      # express:
      #   files: "public/**/*"
      #   tasks: [ "express:dev" ]
      #   options:
      #     spawn: off
      scripts:
        files: [ "public/**/*.coffee", "!Gruntfile.coffee" ],
        tasks: [ "coffee:compile" ]
      styles:
        files: [ "public/**/*.sass" ]
        tasks: [ "sass:compile" ]
      # minificationjs:
      #   files: [ "public/**/*.js", "!public/**/*.min.js" ]
      #   tasks: [ "uglify:minificationall" ]
      minificationcss:
        files: [ "public/**/*.css", "!public/**/*.min.css" ]
        tasks: [ "cssmin:minification" ]

    # uglify:
    #   minificationall:
    #     files: [
    #       expand: on
    #       cwd: "./"
    #       src: [ "public/**/*.js", "!public/lib/**/*", "!public/**/*.min.js" ]
    #       dest: "./"
    #       ext: ".min.js"
    #     ]

    coffee:
      compile:
        files: [
          expand: on
          cwd: "./"
          src: [ "public/**/*.coffee", "!Gruntfile.coffee" ]
          dest: "./"
          ext: ".js"
        ]

    sass:
      compile:
        options:
          sourcemap: "none"
        files: [
          expand: on
          cwd: "./"
          src: [ "public/**/*.sass" ]
          dest: "./"
          ext: ".css"
        ]

    cssmin:
      minification:
        files: [
          expand: on
          cwd: "./"
          src: [ "public/**/*.css" ]
          dest: "./"
          ext: ".min.css"
        ]