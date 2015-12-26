var getBabelRelayPlugin = require('babel-relay-plugin');

var schemaData = require('./data/schema.json').data;

module.exports = getBabelRelayPlugin(schemaData);
