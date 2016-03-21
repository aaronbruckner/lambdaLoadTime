'use strict';

var _ = require('lodash');
var request = require('request');
var q = require('q');
var redis = require('redis');
var passport = require('passport');
var async = require('async');
var nodemailer = require('nodemailer');
var mongoose = require('mongoose');
var validator = require('validator');
var bodyParser = require('body-parser');
var sails = require('sails');
var gulpImagemin = require('gulp-imagemin')

/**
 * ExtraLarge lambda test with a ton of node modules.
 */
exports.handler = function (event, context){
  if(_ && request && q && redis && passport && async && nodemailer && mongoose && validator && bodyParser && sails && gulpImagemin){
    context.succeed('extraLarge');
  } else{
    context.fail('missing require import');
  }
}