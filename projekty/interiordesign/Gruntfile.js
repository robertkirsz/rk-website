module.exports = function (grunt) {

	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

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
		//<script src="http://localhost:35729/livereload.js"></script>
		watch: {
		    all: {
		      files: ['css/*.scss'],
		      tasks: ['sass', 'postcss'],
		      options: { livereload: true }
		    },
		    html: {
                files: ['*.html', '*.php'],
                options: { livereload: true }
            },
            js: {
                files: ['js/*.js'],
                options: { livereload: true }
            }
		},
		jshint: {
			all: ['js/*.js']
		}
	});

};
