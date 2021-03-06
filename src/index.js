#!/usr/bin/env node
const chalk = require('chalk');
const { config } = require('./utils/common_utils.js');
const { login, init } = require('./commands/setup/setup_commands.js');
const { pushFilesystem, pullFilesystem } = require('./commands/filesystem/filesystem_commands.js');
const { pushApi, pullApi } = require('./commands/api/api_commands.js');
const { pullDatabase, pushDatabase } = require('./commands/database/database_commands.js');
const { deployFilesystem, deployApi, deployDb, exportProject } = require('./commands/deploy/deploy_commands.js');
const { setupCheck, help } = require('./utils/common_utils.js');
var argv = require('minimist')(process.argv.slice(2));

async function main() {
  let funcs = {
    'login': login,
    'init': init,
    'help': help,
    'export' : exportProject,
    fs: {
      'push': pushFilesystem,
      'pull': pullFilesystem,
    },
    api: {
      'push': pushApi,
      'pull': pullApi,
    },
    db: {
      'push': pushDatabase,
      'pull': pullDatabase,
    },
  };

  var args = argv._;
  if (args.length === 0) {
    help();
    return;
  }
  delete argv._;
  const argOpts = argv;

  // Check to see if the command (login, init, fs, api, etc.) exists
  if (funcs.hasOwnProperty(args[0])){
    // Check to see a sub-command (push, pull) exists
    if (funcs[args[0]].hasOwnProperty(args[1])) {
      // Run the command, sub-command, and only include first 2 arguments.
      funcs[args[0]][args[1]](args.slice(2), argOpts);
    } else if (funcs[args[0]].length !== undefined) {
      // Run the command, only include first argument.
      funcs[args[0]](args.slice(1), argOpts);
    } else {
      console.log(chalk.red(
        'Invalid command, please refer to the \'help\' command.\n'
      ));
    }
  } else {
    console.log(chalk.red(
        'Invalid command, please refer to the \'help\' command.\n'
      ));
  }

}

main();

process.on('uncaughtException', async function (err) {
  console.log(chalk.red(`error writing : ${err}`));
});