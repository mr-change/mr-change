#!/usr/bin/env node
/* eslint-env node */
'use strict';
const Log = require('../src/log');
const CLI = require('../src/cli');
const MrChange = require('../');
const log = new Log();
const FS = require('fs-extra');
const Path = require('path');
const write = (filename, data) =>
  FS.writeJsonSync(`${Path.normalize(process.cwd())}${Path.sep}${filename}`, data);
// Parse the arguments.
CLI.parse()
// Setup Log.
.then(options => CLI.log(options))
// Launch the CLI.
.then(options => CLI.launch(options))
// Start changelog generation.
.then(options => MrChange.cli(options))
.then(result => write('commits.json', result))
.catch(error => {
  log.error(error);
  // DEBUG: Land (with failure)
  log.debug(Log.color.blue('Landed CLI with failure'));
}) // DEBUG: Land (with success)
.done(() => log.debug(Log.color.blue('Landed CLI with success')));
