const fs = require('fs');
const path = require('path');

const buildDirectory = path.resolve(__dirname, '..', 'build');
const entryPath = path.join(buildDirectory, 'index.html');
const fallbackPath = path.join(buildDirectory, '404.html');

fs.copyFileSync(entryPath, fallbackPath);
