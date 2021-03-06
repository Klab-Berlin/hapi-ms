'use strict';

const pkg = require('./package.json');
const port = (process.env.PORT && !isNaN(process.env.PORT)) ? parseInt(process.env.PORT) : 8000;

// env + env-specific options
var env = process.env.NODE_ENV;
var dbUrl = 'mongodb://localhost/' + pkg.name;

var log = {
  ops: {
    interval: 1000
  },
  reporters: {
    console: [
      {
        module: 'good-console',
        args: [{response: '*', log: '*'}, {format: 'YYYY-MM-DD HH:mm:ss.SSS'}]
      },
      'stdout'
    ]
  }
};

var validate = {
  options: {
    abortEarly: false,
    stripUnknown: true
  }
};

// set final values of env-specific options
switch (env) {
  case 'production':
    break;
  case 'test':
    dbUrl += '-test';
    break;
  default:
    env = 'development';
    dbUrl += '-dev';
}

// export config
module.exports = {
  name: pkg.name,
  version: pkg.version,
  env: env,
  log: log,
  connection: {
    host: process.env.HOST || 'localhost',
    port: port,
    routes: {validate: validate}
  },
  db: {
    url: process.env.DB_URL || dbUrl
  }
};
