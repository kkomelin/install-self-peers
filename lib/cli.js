#!/usr/bin/env node
const spawn = require('cross-spawn');
const { readFileSync } = require('fs');
const {
  generateYarnCLICommand,
  generateNpmCommand,
  generatePnpmCLICommand,
} = require("./utils");

const argv = require("minimist")(process.argv.slice(2), {
  default: {
    execute: true,
    npm: false,
    yarn: false,
  },
});

const generatorFn = ((npm, yarn) => {
  if(npm === true) {
    return generateNpmCommand;
  }

  if (yarn === true) {
    return generateYarnCLICommand;
  }

  return generatePnpmCLICommand;
})(argv.npm, argv.yarn);

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const commandConfig = generatorFn(pkg.peerDependencies);
commandConfig.args = commandConfig.args.concat(argv._);

if(argv.execute === true) {
  const cli = spawn(
    commandConfig.cmd,
    commandConfig.args,
    { stdio: 'inherit' }
  );
  cli.on('close', () => process.exit());
} else {
  const command = `${commandConfig.cmd} ${commandConfig.args.join(' ')}`
  console.log(command);
  return;
}
