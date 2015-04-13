#!/usr/bin/env node

require('babel/register');

var minimist = require('minimist'),
    path = require('path'),
    es6ng = require('../lib/index'),
    options = minimist(process.argv.slice(2)),
    args = options._;
delete options._;

if(args[0] == 'compile') {
    var cwd = args[1] || process.cwd();
    var src = path.join(cwd, 'src'),
        dest = path.join(cwd, 'dist');
    es6ng.compile(src, dest, options);
} else {
    console.log('ngxt - es6 module compiler for angular.', args, options);
}