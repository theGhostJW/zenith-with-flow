'use strict';

var Gaze = require('gaze').Gaze;

var gaze = new Gaze('./src/**/*.js');

function yarnArg() {
  return process.argv[2];
}

// Files have all started watching
gaze.on('ready', function(watcher) {
  console.log(`Watcher Started: ${yarnArg()}`);
});

// A file has been added/changed/deleted has occurred
gaze.on('all', function(event, filepath) {
  console.log('Change Detected');
  const spawn = require( 'child_process' ).spawn,
        child = spawn('yarn.cmd', [yarnArg()], { env : { FORCE_COLOR: true }});

   child.stdout.on( 'data', data => {
      console.log(`${data}`);
   });

   child.stderr.on( 'data', data => {
      console.log( `stderr: ${data}` );
   });

   child.on('exit', function (code, signal) {
     console.log('child process exited with ' +
              `code ${code} and signal ${signal}`);
  });
});
