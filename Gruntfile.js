module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		sass: {
			options: {
				outputStyle: 'compact'
			},
			dist: {
				files: {
					'css/main.css': 'css/main.scss'
				}
			}
		},
		postcss: {
			options: {
				map: false,
				processors: [
					require('autoprefixer-core')({
						browsers: ['last 2 versions']
					})
				]
			},
			dist: {
				src: 'css/main.css'
			}
		},
		babel: {
      options: {
        sourceMap: true,
        presets: ['latest']
      },
      dist: {
        files: {
          'js/main.js': 'js/main.es6.js'
        }
      }
    },
		//<script src="http://localhost:35729/livereload.js"></script>
		watch: {
	    all: {
	      files: ['css/*.scss'],
	      tasks: ['sass', 'postcss'],
	      options: { livereload: true }
	    },
	    html: {
        files: ['*.html'],
        options: { livereload: true }
      },
      js: {
        files: ['js/*.es6.js'],
				tasks: ['babel'],
        options: { livereload: true }
      }
		},
		jshint: {
			all: ['js/*.js']
		}
	});
};
