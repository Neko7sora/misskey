const chokidar = require('chokidar');

//gulp.task watch
chokidar.watch('./../packages/*/src/**/*').on('all', (event, path) => {
	execa('pnpm', ['build-post'], {
		cwd: __dirname + '/',
		stdout: process.stdout,
		stderr: process.stderr,
	});
});
