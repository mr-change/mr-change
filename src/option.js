'use strict';
const chalk = require('chalk');
const gray = chalk.gray;

class Option {
  static normalize(options) {
    return {
      version: options.version || options.v,
      project: options.project || options.p,
      release: options.release || options.r,
      token: options.token || options.t,
      output: options.output || options.o,
      log: options.level || options.l,
    };
  }
  static get cli() {
    return {
      cwd: {
        type: 'string',
        describe: gray('Set current working directory.'),
        default: process.cwd(),
      },
      version: {
        alias: 'v',
        type: 'boolean',
        describe: gray('Print the global version.'),
      },
      project: {
        alias: 'p',
        type: 'string',
        describe: gray('Set the project name. i.e. github.com/isaacs/npm, isaacs/npm, npm'),
      },
      release: {
        alias: 'r',
        type: 'string',
        describe: gray('Set the project release version. i.e. latest, all, [number], x.x.x'),
        default: 'all',
      },
      token: {
        alias: 't',
        type: 'string',
        describe: gray('Set the GitHub token.'),
      },
      output: {
        alias: 'o',
        type: 'string',
        default: 'terminal',
        describe: gray('Set the output format. i.e terminal, markdown, json.'),
      },
      level: {
        alias: 'l',
        type: 'string',
        default: 'info, warn, error',
        describe: chalk.gray(`Set the log level. Levels: ${[
          chalk.green('debug'),
          chalk.blue('info'),
          chalk.yellow('warn'),
          chalk.red('error'),
          chalk.gray('silent'),
        ].join(', ')}`),
      },
    };
  }
}

module.exports = Option;
