'use strict';

var _ = require('lodash');
var request = require('request');
var q = require('q');
var redis = require('redis');
var passport = require('passport');
var async = require('async');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');

/**
 * Large lambda test with lots of node modules.
 */
exports.handler = function (event, context){
  if(_ && request && q && redis && passport && async && nodemailer && mongoose){
    context.succeed('large');
  } else{
    context.fail('missing require import');
  }
}