'use strict';

const ChangeLog = require('./src/changelog');
const Option = require('./src/option');
class MrChange {
  static cli(options) {
    return ChangeLog.generate(Option.normalize(options));
  }
}

module.exports = MrChange;
