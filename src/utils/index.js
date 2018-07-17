// index

const exec = require('child_process').execSync;
const {
  existsSync,
  unlinkSync,
} = require('fs');
const mkdir = require('mkdirp').sync;

const rmdir = (d) => {
  return exec(`rm -rf ${d}`);
};

const fixPath = require('./fixPath');
const readFile = require('./readFile');
const writeFile = require('./writeFile');
const delFile = (f) => unlinkSync(f);
const exists = (f) => existsSync(f);

const normalize = require('./normalize');
const logger = require('./logger');

module.exports = {
  fixPath,
  readFile,
  writeFile,
  delFile,
  exists,
  mkdir,
  rmdir,
  normalize,
  logger,
};
