const base = require('./base');
const env = process.env.NODE_ENV || 'development';
const { merge } = require('webpack-merge');
const activeConfig = require(`./${env}.js`);

module.exports = merge(base, activeConfig);
