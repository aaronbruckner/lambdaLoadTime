/**
 * Lambda load time tester. This module was written to test the effects of code size on initialization time of AWS
 * lambda functions.
 *
 * To do this, code packages are initially uploaded to S3. Using S3 as the provider for lambda function code, functions
 * are continually created, ran once, and then destroyed. This allows the test to incur the initial load time AWS
 * undergoes when it hasn't already loaded your lambda code onto a server.
 *
 * @author Aaron Bruckner
 */

'use strict';

// Instructs AWS to use my personal profile already configured using the aws-cli.
// Update to use your profile or remove to use default.
process.env.AWS_PROFILE = 'aaron';

var AWS =  require('aws-sdk');
var lambda = new AWS.Lambda({region: 'us-west-2'});

// Configuration - script expects code to be located in the bucket under 'functions/<functionType>.zip'
var s3Bucket = 'aaronbruckner'; // Bucket that holds the test code zips
var lambdaRoleARN = 'arn:aws:iam::249332120762:role/lambda_basic_execution'; // IAM role to run lambda function with

/**
 * Takes an array of function types to test. Each function type builds a new lambda function. This function is executed
 * once and rebuild again to test how long it takes AWS to load a new function.
 *
 * @param {string[]} functionTypes - array of functions to test (micro||small||medium||large||extraLarge||huge||insane).
 * @param {number} intervalLimit - the total number of runs to execute against each function.
 */
function testLambdaInit(functionTypes, intervalLimit){
  var functionType = functionTypes.shift();
  var interval = intervalLimit;

  console.log('\nTest Start: ' + functionType + '\n');

  if (intervalLimit < 0) {
    throw 'Interval must be a positive integer';
  }

  var intervalStatistics = [];

  // Invoked after every test loop, terminates test after loop limit reached.
  function intervalLoop (stats) {
    interval--;
    intervalStatistics.push(stats);

    if(interval > 0){
      console.log('Remaining Loops: ' + interval);
      invokeLambdaFunction(functionType, intervalLoop);
    } else {
      generateStatistics();

      // Start next test if any functions remain
      if(functionTypes.length > 0){
        testLambdaInit(functionTypes, intervalLimit)
      }
    }
  }

  // Outputs statistics for the current function under test.
  function generateStatistics(){
    var averageRequestLength = 0;

    for(var i = 0; i < intervalStatistics.length; i++){
      averageRequestLength += intervalStatistics[i].totalTime;
    }

    averageRequestLength = averageRequestLength / intervalStatistics.length;

    console.log('\n---Statistics for ' + functionType + '---\n');
    console.log('Average request length (ms): ' + averageRequestLength);
    console.log('\n------------------------------\n')
  }

  invokeLambdaFunction(functionType, intervalLoop);
}

/**
 * Invokes a Lambda function. Creates it, invokes it, and then deletes it. This is done to ensure the
 * function is not already loaded into an AWS node to test first load initialisation time.
 *
 * Done function is invoked with a single stats parameter that holds information about the invocation. Stats
 * looks like:
 * {
 *   startTime - Date when lambda request was started
 *   finishTime - Date when lambda request returns
 *   totalTime - total request time in milliseconds
 * }
 *
 * @param {String} functionType - the type of function to test (micro||small||medium||large||extraLarge).
 * @param {function} done - function to invoke when invocation is complete and function is cleaned up.
 */
function invokeLambdaFunction(functionType, done){
  createLambdaFunction(functionType, function(error, data){
    if(error){
      console.log('Error invoking function: ' + functionType);
    }

    invoke();
  });

  // Called after the function is created, invokes function under test and creates statistics.
  function invoke(){
    var stats = {
      startTime: new Date()
    };

    var params = {
      FunctionName: functionType,
      InvocationType: 'RequestResponse',
      LogType: 'Tail'
    };

    lambda.invoke(params, function(error, data){
      if (error) {
        console.log('Error invoking function: ' + functionType);
      }

      // Calculate length of request
      stats.finishTime = new Date();
      stats.totalTime = stats.finishTime - stats.startTime;


      deleteLambdaFunction(functionType, function(error, data){
        if(error){
          console.log('Error deleting function: ' + functionType);
        }

        done(stats);
      });
    });
  }
}

/**
 * Creates a lambda function.
 *
 * @param {String} functionType - the type of function to test (micro||small||medium||large||extraLarge||huge||insane).
 * @param {function} callback - function to invoke after creation.
 */
function createLambdaFunction(functionType, callback){
  var params = {
    Code: {
      S3Bucket: s3Bucket,
      S3Key: 'functions/' + functionType + '.zip'
    },
    FunctionName: functionType,
    Runtime: 'nodejs',
    Role: lambdaRoleARN,
    Handler: functionType + '.handler',
    MemorySize: 128
  };

  lambda.createFunction(params, callback);
}

/**
 * Deletes a lambda function.
 *
 * @param {String} functionType - the type of function to test (micro||small||medium||large||extraLarge||huge||insane).
 * @param {function} callback - function to invoke after deletion.
 */
function deleteLambdaFunction(functionType, callback){
  var params = {
    FunctionName: functionType
  };

  lambda.deleteFunction(params, callback);
}

// Run 5 intervals for every function type
testLambdaInit(['micro', 'small', 'medium', 'large', 'extraLarge', 'huge', 'insane'], 5);