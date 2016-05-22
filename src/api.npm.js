'use strict';

const Promise = require('bluebird');
const request = require('request-promise');
const semver = require('semver');
const npmURL = moduleName => `https://registry.npmjs.org/${moduleName}`;
const _ = require('lodash');

class NPM {
  static getRepoURL(body) {
    let repo;
    ['repository', 'repositories', 'bugs', 'licenses'].forEach(branch => {
      if (!repo) {
        let tree = body[branch];
        repo = tree && tree.url ? tree.url : undefined;
        if (!repo) tree = tree[0];
      }
    });
    return repo;
  }
  /**
   * @returns {PromiseLike<Object>}
   */
  static getInfo(name) {
    const url = npmURL(name);
    return request({ uri: url, json: true })
    .then(body => {
      if (body.error === 'not_found') {
        return Promise.reject(`npm module "${name}" was not found.`);
      }
      return Promise.resolve(body);
    });
  }
  static listCommits(name) {
    return NPM.getInfo(name)
    .then(body => {
      let repo = NPM.getRepoURL(body);
      if (!repo && body.versions) {
        Object.keys(body.versions).forEach(version => {
          if (!repo) repo = NPM.getRepoURL(body.versions[version]);
        });
      }
      if (!repo) {
        return Promise
        .resolve(`The author did not specify the repository URL in the package.json for ${name}.`);
      }
      if (!body.time) return Promise.reject(`No published versions for ${name} were found.`);
      return Promise.resolve({ body, repo });
    });
  }
  static process(options) {
    return NPM.listCommits(options.project)
    .then(commits => {
      const time = commits.body.time;
      delete time.created;
      delete time.modified;
      let versions = Object.keys(time)
      .map(version => ({ version, date: new Date(time[version]) }))
      .filter(t => (semver.valid(t.version)));
      versions = _.compact(versions).sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return 0;
      });
      return Promise.resolve({ versions, commits, options });
    });
  }
}

module.exports = NPM;
