'use strict';

/**
 * Micro lambda test with no node modules.
 */
exports.handler = function (event, context){
  context.succeed('micro');
}