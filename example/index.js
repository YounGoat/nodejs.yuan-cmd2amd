var fs = require('fs');
var path = require('path');
var cmd2amd = require('../index.js');

var code = fs.readFileSync(path.join(__dirname, 'src', 'index.js'), 'utf8');
console.log('-- INPUT --');
console.log(code);

console.log();
console.log('-- OUTPUT (default) --');
console.log(cmd2amd(code, 'FOO'));

console.log();
console.log('-- OUTPUT (execOnRequired:true)--');
console.log(cmd2amd(code, 'FOO', { execOnRequired: true }));

console.log();
console.log('-- OUTPUT (moduleBuiltIn:true)--');
console.log(cmd2amd(code, 'FOO', { moduleBuiltIn: true }));
