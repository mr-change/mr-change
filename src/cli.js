
/* eslint-env node */
'use strict';
const Log = require('./log');
const Liftoff = require('liftoff');
const Option = require('./option');
const Path = require('path');
const Promise = require('bluebird');
const Yargs = require('yargs');
const _ = require('lodash');

const mrchangePkg = require('../package.json');
const projectPkg = require(`${Path.normalize(process.cwd())}${Path.sep}package.json`);
const log = new Log();
const v8flags = require('v8flags');

class CLI {
  /**
   * Parse the CLI arguments.
   * @static
   * @return {Promise<options>} - A promise to the options.
   */
  static parse() {
    return Promise.resolve(Yargs
    .usage('Usage: mrchange [options]', Option.cli)
    .help('help', Log.color.gray('Show help.'))
    .alias('help', 'h')
    .argv);
  }
  /**
   * Setup the logger.
   * @param  {Object} options - The parsed CLI arguments.
   * @return {Promise<options>} - A promise to the options.
   */
  static log(options) {
    // Get log level.
    const level = options.level || options.l || 'info,warn';
    // Set up the logger.
    Log.setup({
      level: level !== 'silent' ? level : '',
      silent: level === 'silent',
    });
    return Promise.resolve(options);
  }
  /**
   * Create the CLI.
   * @static
   * @return {Liftoff} - An instance of Liftoff.
   */
  static get rocket() {
    // Create the CLI.
    return new Liftoff({
      name: 'mrchange',
      processTitle: 'mrchange',
      v8flags,
    });
  }
  /**
   * Launch the CLI.
   * @static
   * @param {Object} options - The parsed CLI arguments.
   * @return {PromiseLike<Stream>} - A promise to the stream.
   */
  static launch(options) {
    // DEBUG: Launch
    log.debug(Log.color.blue('Launching CLI'));
    return new Promise((resolve, reject) => {
      // Launch the CLI
      CLI.rocket.launch({
        cwd: options.cwd,
        configPath: options.mrdocrc,
      }, env => CLI.handler(env, options)
      .then(opts => resolve(opts))
      .catch(error => reject(error)));
    });
  }
  /**
   * Handle the result from the CLI.
   * @private
   * @static
   * @return {Promise<options>} - A promise to the options.
   */
  static handler(env, options) {
    const version = options.version || options.v;
    const project = options.project || options.p;
    const opts = options;
    if (version) {
      log.info(`${Log.color.blue('version:')} ${mrchangePkg.version}`);
      process.exit();
    }
    if (_.isEmpty(project) && version === false) {
      opts.project = projectPkg.repository;
    }
    return Promise.resolve(opts);
  }
}

module.exports = CLI;
