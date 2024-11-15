import chokidar from 'chokidar'
import { exec } from 'child_process'  // Node.js child process module

// Start the Bun server (replace with your actual server file)
const startServer = () => {
  const server = exec('bun .', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    log(`stdout: ${stdout}`);
  });

  // Kill the previous server process before restarting
  server.on('exit', () => {
    log('Server restarted');
  });
}

// Initialize the file watcher on the "src" directory
const watcher = chokidar.watch('src/**/*.ts', {
  persistent: true,
});

watcher.on('change', (path) => {
  log(`File changed: ${path}`);
  startServer(); // Restart the server when a file changes
});

log('Watching for file changes...');
startServer(); // Start the server initially


function log(msg: any) {
  console.log(`live_reload.ts: ${msg}`);
}