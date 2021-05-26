
/*
 * 
 *  Starting at port 8080, increment port by one until a free port is found
 *
 */

async function getAvailablePort() {
  const port = 8080;
  for await ( const result of checkPorts(port) ) {
    if (result.available) {
      return result.port;
    }
  }
}

async function* checkPorts(port) {
  let available;
  while (!available) {
    if (['linux', 'darwin'].includes(process.platform)) {
      available = await checkPortMacLinux(port).catch((err) => console.error(err));
    } else {
      available = await checkPortWindows(port).catch((err) => console.error(err));
    }
    yield {port, available};
    port += 1;
  }
}

function checkPortMacLinux(port) {
  const spawn = require('child_process').spawn;
  return new Promise((resolve, reject) => {
    const lsof = spawn('lsof', ['-i', `:${port}`]);
    const grep = spawn('grep', ['LISTEN']);
    lsof.stdout.pipe(grep.stdin);
    grep.stdout.on('data', (data) => {
      const grepResult = data.toString();
      // console.log(`port ${port} in use`);
      // console.log(grepResult);
    });
    lsof.stderr.on('data', (data) => {
      const err = `checkPortMacLinux() lsof Error:\n${data.toString()}`;
      reject(err);
    });
    grep.stderr.on('data', (data) => {
      const err = `checkPortMacLinux() grep Error:\n${data.toString()}`;
      reject(err);
    });
    grep.on('close', (code) => {
      if (code !== 1) {
        resolve(false);
      }
      resolve(true);
    });
  });
}

function checkPortWindows(port) {
  const spawn = require('child_process').spawn;
  const cmd = spawn('cmd');
  const EOL = /(\r\n)|(\n\r)|\n|\r/;
  return new Promise((resolve, reject) => {
    let stdout = '';
    cmd.stdout.on('data', (data) => {
      stdout += data.toString();
    });
   cmd.on('exit', (code) => {
      stdout = stdout.split(EOL);
      stdout.forEach(line => {
        if (line !== undefined && line.includes(`:${port}`)) {
          resolve(false)
        }
      });
      resolve(true);
   });
    cmd.stderr.on('data', (data) => {
      const err = `checkPortWindows() Error:\n${data.toString()}`;
      reject(err);
    });
    cmd.stdin.write(`netstat -aof\n`);
    cmd.stdin.end();
  });
}

module.exports = (function(){
  return {
    getAvailablePort,
  }
})();
