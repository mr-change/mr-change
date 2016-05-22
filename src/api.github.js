'use strict';
const GH = require('github-api');
const Promise = require('bluebird');
const parseUrl = require('parse-github-url');
const moment = require('moment');
class GitHub {
  static listCommits(options) {
    const token = (options.options || options).token;
    const github = !!token ? new GH({ token }) : (new GH());
    const githubUrl = parseUrl(options.options ? options.commits.repo : options.project);
    return new Promise((resolve, reject) => {
      const user = githubUrl.owner;
      const repo = githubUrl.name;
      const repository = github.getRepo(user, repo);
      repository.listCommits(null, (error, commits) => {
        if (error) reject(error);
        if (!commits.map) reject(commits.message || JSON.stringify(commits));
        const data = commits.map(body => ({
          sha: body.sha,
          date: body.commit.committer.date,
          author: {
            name: body.commit.author.name,
            username: body.author.name,
            avatar_url: body.author.avatar_url,
            html_url: body.author.html_url,
          },
          committer: {
            name: body.commit.committer.name,
            username: body.committer.login,
            avatar_url: body.committer.avatar_url,
            html_url: body.committer.html_url,
          },
          message: body.commit.message,
          tree: body.commit.tree,
        }));
        resolve({ commits: data, options: options.options || options });
      });
    });
  }
  static process(npm) {
    const options = npm.options ? npm.options : npm;
    return GitHub.listCommits(npm.options ? npm : npm)
    .then(data => {
      let versions = [];
      const cache = {};
      if (data.commits) {
        data.commits.forEach(commit => {
          if (commit) {
            const date = moment(commit.date).format('YYYY-MM-DD');
            cache[date] = cache[date] || { date: new Date(date), commits: [] };
            cache[date].commits.push(commit);
          }
        });
      }
      Object.keys(cache).forEach(date => versions.push(cache[date]));
      const release = (npm.options ? npm : options).release;
      if (release) {
        let tempVersions = [];
        // All == all versions
        if (release.toString().toLowerCase() === 'all') {
          tempVersions = versions;
        // Latest == Latest single version
        } else if (release.toString().toLowerCase() === 'latest') {
          tempVersions.push(versions[0]);
        // Integer == that many versions.  1 = one version.
        } else if (parseInt(release, 10) === release) {
          for (let i = 0; i < Math.min(release, versions.length - 1); i++) {
            tempVersions.push(versions[i]);
          }
        // Require valid version
        } else {
          throw new Error('Github\'s API does not yet support release versions.');
        }
        versions = tempVersions;
      }
      return Promise.resolve({ result: data, versions, options: npm.options || options });
    });
  }
}

module.exports = GitHub;
