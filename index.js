'use strict';

var MODULE_REQUIRE
	, UglifyJS = require('uglify-js')
	, yuan = require('yuan')
	;

var MODULE_VARNAME_PREFIX = '_MODULE_INS_';
var OPTIONS_DEFAULT = {
	'symbolDefine': 'define',
	'symbolRequire': 'require'
};

var MODULES = [], TOP_NAME, OPTIONS = {};

var transformer = new UglifyJS.TreeTransformer(function(node, descend) {
	if (node instanceof UglifyJS.AST_Toplevel) {
		descend(node, this);

		// 构建语法树：。
		// Function(String, [ String, ... ], Function(SymbolFunarg, ...) { body })。

		// 创建“字符串”节点。
		var nodeString = new UglifyJS.AST_String({ value: TOP_NAME });

		// 创建“字符串”节点数组。
		var names = [];
		if (!OPTIONS.moduleBuiltIn) {
			names.push(new UglifyJS.AST_String({ value: 'module' }));
		}

		MODULES.forEach(function(name) {
			// 创建字符串节点，添加到数组中。
			names.push(new UglifyJS.AST_String({ value: name }));
		});

		// 创建“数组”节点。
		var nodeArray = new UglifyJS.AST_Array({
			elements: names
		});

		// 创建“函数参数”节点数组。
		var funargs = [], varnames = [];
		if (!OPTIONS.moduleBuiltIn) {
			varnames.push('module');
		}

		MODULES.forEach(function(name, index) {
			varnames.push(MODULE_VARNAME_PREFIX + index);
		});
		varnames.forEach(function(varname) {
			// 创建函数参数符号节点，添加到数组中。
			funargs.push(new UglifyJS.AST_SymbolFunarg({ name: varname }));
		});

		// 创建“函数”节点。
		var nodeFunction = new UglifyJS.AST_Function({
			argnames: funargs,
			body: node.body
		});

		// 创建“返回”节点。
		var nodeReturn = new UglifyJS.AST_Return({
			value: new UglifyJS.AST_SymbolRef({ name: 'module.exports' })
		});
		nodeFunction.body.push(nodeReturn);

		// 创建“函数调用”节点。
		var nodeDefine = new UglifyJS.AST_Call({
			expression: new UglifyJS.AST_SymbolRef({ name: OPTIONS.symbolDefine }),
			args: [ nodeString, nodeArray, nodeFunction ]
		});

		return nodeDefine;
	}

	// 捕捉所有的 require() 调用。
	else if (node instanceof UglifyJS.AST_Call && node.start.value == 'require') {

		// 获取 require 参数字符串值。
		var requireName = node.args[0].value;
		MODULES.push(requireName);

		if (OPTIONS.execOnRequired) {
			return new UglifyJS.AST_Call({
				expression: new UglifyJS.AST_SymbolRef({ name: OPTIONS.symbolRequire }),
				args: [ new UglifyJS.AST_String({ value: requireName }) ]
			});
		}
		else {
			var varname = MODULE_VARNAME_PREFIX + (MODULES.length - 1);

			// 用“变量引用”节点替代 require() “函数调用”节点。
			return new UglifyJS.AST_SymbolRef({ name: varname });
		}
	}
});

var _ME = function(code, name, options) {
	MODULES = [];
	TOP_NAME = name;

	if (options) {
		OPTIONS = yuan.object.extend(OPTIONS_DEFAULT, options);
	}
	else {
		OPTIONS = OPTIONS_DEFAULT;
	}

	if (OPTIONS.moduleBuiltIn) {
		code = 'var module = { exports: {} };' + code;
	}

	var ast = UglifyJS.parse(code);
	ast = ast.transform(transformer);

	var stream = UglifyJS.OutputStream({
		indent_start  : 0,     // start indentation on every line (only when `beautify`)。
		indent_level  : 4,     // indentation level (only when `beautify`)。
		quote_keys    : false, // quote all keys in object literals?。
		space_colon   : true,  // add a space after colon signs?。
		ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)。
		inline_script : false, // escape "</script"?。
		width         : 80,    // informative maximum line width (for beautified output)。
		max_line_len  : 32000, // maximum line length (for non-beautified output)。
		beautify      : true, // beautify output?。
		source_map    : null,  // output a source map。
		bracketize    : false, // use brackets every time?。
		comments      : false, // output comments?。
	});
	ast.print(stream);
	return stream.toString();
};

module.exports = _ME;
