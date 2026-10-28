#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// If running in development (TypeScript files exist and dist doesn't)
const distPath = path.join(__dirname, '..', 'dist', 'index.js');
const srcPath = path.join(__dirname, '..', 'src', 'index.ts');

if (fs.existsSync(distPath)) {
  require(distPath);
} else {
  // Use ts-node on the fly if dist is not compiled yet
  require('ts-node').register({
    transpileOnly: true,
    project: path.join(__dirname, '..', 'tsconfig.json')
  });
  require(srcPath);
}
