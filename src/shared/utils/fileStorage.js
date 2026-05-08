const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

function copyFile(source, destination) {
  ensureDir(path.dirname(destination));
  fs.copyFileSync(source, destination);
}

module.exports = {
  ensureDir,
  writeJson,
  copyFile
};