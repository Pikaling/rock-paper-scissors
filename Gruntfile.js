/**
 * Created by vickidunlop on 09/10/2014.
 */

module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
       pkg: grunt.file.readJSON('package.json'),
        bower: {
            install: {
                options: {
                    cleanBowerDir: true
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'src/js/**/*.js', 'test/**/*.js']
        },
        qunit: {
            all: ['test/runner.html']
        },
        concat: {
            project: {
                src: 'src/js/**/*.js',
                dest: 'build/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'build/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.js'
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task
    grunt.registerTask('default', ['concat', 'uglify']);

    // Additional tasks
    grunt.registerTask('test', ['bower', 'jshint', 'qunit']);
    grunt.registerTask('complete', ['bower', 'jshint', 'qunit', 'concat', 'uglify']);

};

