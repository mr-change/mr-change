'use strict';
const GitHub = require('./api.github');
const Log = require('mr-doc-utils').Log;
const NPM = require('./api.npm');
const log = new Log();
const parseUrl = require('parse-github-url');
class ChangeLog {
  /**
   * @param { options: Object }
   * @returns {Object}
   */
  static generate(options) {
    const githubUrl = parseUrl(options.project);
    const user = githubUrl.owner;
    const repo = githubUrl.name;
    const isNPM = user === null && repo === null;

    if (isNPM) {
      log.debug(Log.color.blue(`Using npm module "${options.project}"`))
      return NPM.process(options)
      .then(npm => GitHub.process(npm));
    }
    log.debug(Log.color.blue(`Using GitHub repository "${repo}"`));
    return GitHub.process(options);
  }
}

module.exports = ChangeLog;
