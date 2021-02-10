#!/usr/bin/env node
require = require('esm')(module /*, options*/);
require('./cli').cli();
module.exports = {
    convertCssStringIntoJsModule: require('./convertCssStringIntoJsModule').default,
    transpile: require('./transpile').default
}