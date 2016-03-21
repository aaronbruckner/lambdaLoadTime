'use strict';

var _ = require('lodash');

/**
 * Small lambda test with minimal node modules.
 */
exports.handler = function (event, context){
  if(_){
    context.succeed('small');
  } else{
    context.fail('missing require import');
  }
}