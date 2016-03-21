'use strict';

var _ = require('lodash');
var request = require('request');
var q = require('q');

/**
 * Medium lambda test with a few node modules.
 */
exports.handler = function (event, context){
  if(_ && request && q){
    context.succeed('medium');
  } else{
    context.fail('missing require import');
  }
}