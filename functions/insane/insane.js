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
var gulpImagemin = require('gulp-imagemin');
var uglifyJs = require('uglify-js');
var superagent = require('superagent');
var minimist = require('minimist');
var mongodb = require('mongodb');
var jshint = require('jshint');
var connect = require('connect');
var morgan = require('morgan');
var winston = require('winston');
var handlebars = require('handlebars');
var nodeUuid = require('node-uuid');
var expressSession = require('express-session');
var phantomjs = require('phantomjs');


/**
 * Insane lambda test with a abnormal number of node modules.
 */
exports.handler = function (event, context){
  // Bad running if statements I never do in real life...
  if(_ && request && q && redis && passport && async && nodemailer && mongoose && validator && bodyParser && sails &&
    gulpImagemin && uglifyJs && superagent && minimist && mongodb && jshint && connect && morgan && winston
    && handlebars && nodeUuid && expressSession && phantomjs){
    context.succeed('insane');
  } else{
    context.fail('missing require import');
  }
};