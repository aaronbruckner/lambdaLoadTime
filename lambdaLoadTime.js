'use strict';

process.env.AWS_PROFILE = 'aaron';
var AWS =  require('aws-sdk');
var lambda = new AWS.Lambda({region: 'us-west-2'});

var s3CodeBase = 'https://s3-us-west-2.amazonaws.com/aaronbruckner/functions/';

function callback(error, data){
  var log = new Buffer(data.LogResult, 'base64').toString();
  console.log('Function return data: ' + data);
  console.log('Error: ' + error);
}

var params = {
  FunctionName: 'test',
  InvocationType: 'RequestResponse',
  LogType: 'Tail'
};

lambda.invoke(params, callback);

/**
 * Takes a function type and builds a new lambda function. This function is executed once and rebuild again to test
 * how long it takes AWS to load a new function.
 *
 * @param {String} functionType - the type of function to test (micro||small||medium||large||extraLarge).
 *
 * micro
 */
function testLambdaInit(functionType){
  var s3Path = s3CodeBase + functionType + '.zip';

}

testLambdaInit('micro');