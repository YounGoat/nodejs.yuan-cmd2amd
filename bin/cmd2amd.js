#!/usr/bin/env node

'use strict';

var MODULE_REQUIRE
	, fs = require('fs')
	, path = require('path')
	, minimist = require('minimist')
	, yuancon = require('yuan-console')
	;

var cmd2amd = require('../index');
var exit = function(msg, code) {
	if (!code) code = 1;
	yuancon.print.warning('[CMD2AMD] ' + msg);
	process.exit(code);
}

var argv = minimist(process.argv.slice(2));

if (argv.h || argv.help) {
	yuancon.print.markup(fs.readFileSync(path.join(__dirname, '..', 'help.yuan')));
	process.exit(0);
}

if (!argv.input) {
	exit('Please specify the input file name.');
}

if (!fs.existsSync(argv.input)) {
	exit('File "' + argv.input + '" not found or inaccessible.');
}

if (argv.output) {
	argv.output = path.resolve(argv.output);
	try {
		yuancon.fs.mkdirp(pat.dirname(argv.output));
	}
	catch (ex) {
		exit(ex);
	}
}

if (!argv.name) {
	argv.name = path.basename(argv.input).replace(/\.js$/, '');
}

var code = fs.readFileSync(argv.input, 'utf8');
console.log(code);

var OPTIONS = {};
OPTIONS.runOnRequired = !!argv['run-on-required'];
OPTIONS.moduleBuiltIn = !!argv['module-built-in'];

code = cmd2amd(code, argv.name, OPTIONS);

if (argv.output) {
	fs.writeFileSync(argv.output, code, 'utf8');
}
else {
	console.log(code);
}
