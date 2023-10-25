process.env.NODE_ENV = 'development';

const Vite = require('vite');
const ChildProcess = require('child_process');
const Path = require('path');
const Chalk = require('chalk');
const Chokidar = require('chokidar');
const Electron = require('electron');
const compileTs = require('./private/tsc');
const FileSystem = require('fs');
const { EOL } = require('os');

let electronProcess = null;
let electronProcessLocker = false;
let browserViteServer;
let overlayViteServer;

let browserRendererPort = 0;
let overlayRendererPort = 0;

async function startRenderer() {
  browserViteServer = await Vite.createServer({
    configFile: Path.join(__dirname, '..', 'src', 'browser', 'vite.config.js'),
    mode: 'development',
  });
  browserRendererPort = browserViteServer.config.server.port;
  await browserViteServer.listen();

  overlayViteServer = await Vite.createServer({
    configFile: Path.join(__dirname, '..', 'src', 'overlay', 'vite.config.js'),
    mode: 'development',
  });
  overlayRendererPort = overlayViteServer.config.server.port;
  await overlayViteServer.listen();
}

async function startElectron() {
    if (electronProcess) { // single instance lock
  return;
}

try {
  await compileTs(Path.join(__dirname, '..', 'src', 'main'));
} catch (e) {
  console.log(Chalk.redBright('Could not start Electron because of the above typescript error(s).'));
  electronProcessLocker = false;
  return;
}

const args = [
  Path.join(__dirname, '..', 'build', 'main', 'main.js'),
  overlayRendererPort,
  browserRendererPort,
];
electronProcess = ChildProcess.spawn(Electron, args);
electronProcessLocker = false;

electronProcess.stdout.on('data', data => {
  if (data == EOL) {
    return;
  }

  process.stdout.write(Chalk.blueBright(`[electron] `) + Chalk.white(data.toString()))
});

electronProcess.stderr.on('data', data =>
  process.stderr.write(Chalk.blueBright(`[electron] `) + Chalk.white(data.toString()))
  );

electronProcess.on('exit', () => stop());
}

function restartElectron() {
  if (electronProcess) {
    electronProcess.removeAllListeners('exit');
    electronProcess.kill();
    electronProcess = null;
  }

  if (!electronProcessLocker) {
    electronProcessLocker = true;
    startElectron();
  }
}

function copyStaticFiles() {
  copy('static');
}

/*
The working dir of Electron is build/main instead of src/main because of TS.
tsc does not copy static files, so copy them over manually for dev server.
*/
function copy(path) {
  FileSystem.cpSync(
    Path.join(__dirname, '..', 'src', 'main', path),
    Path.join(__dirname, '..', 'build', 'main', path),
    { recursive: true }
    );
}

function stop() {
  try {
    browserViteServer.stop();
  } catch (e) {}

  try {
    overlayViteServer.stop();
  } catch (e) {}

  process.exit();
}

async function start() {
  console.log(`${Chalk.greenBright('=======================================')}`);
  console.log(`${Chalk.greenBright('Starting Electron + Vite Dev Server...')}`);
  console.log(`${Chalk.greenBright('=======================================')}`);

  const devServer = await startRenderer();

  copyStaticFiles();
  startElectron();

  const path = Path.join(__dirname, '..', 'src', 'main');
  Chokidar.watch(path, {
    cwd: path,
  }).on('change', (path) => {
    console.log(Chalk.blueBright(`[electron] `) + `Change in ${path}. reloading... 🚀`);

    if (path.startsWith(Path.join('static', '/'))) {
      copy(path);
    }

    restartElectron();
  });
}

start();
