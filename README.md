yuan-cmd2amd is used to transform javascript code from CMD to AMD. Here, CMD means Common Module Definition, and AMD means Asynchronous Module Definition. When globally installed through ```npm install -g yuan-cmd2amd```, a command named ```cmd2amd``` will be created in your system. You may also invoke such functionality through an API provided by ```require('yuan-cmd2amd')```. In current version, recursive transformation is NOT supported yet.

##	Install

```bash
npm install -g yuan-cmd2amd
```

##	Run In CLI

```bash
# Display help info.
cmd2amd -h

# Transfer js file.
cmd2amd --input ./some.js --output ./some.amd.js
```

##	API

```javascript
var cmd2amd = require('yuan-cmd2amd');

var cmdCode = fs.readFileSync('/path/to/jsfile', 'utf8');
var options = {
	runOnRequired : false,
	moduleBuiltIn : false
};
var amdCode = cmd2amd(cmdCode, options);
```

##	Demo

```bash
# Run demo.
cd $(npm root -g)/yuan-cmd2amd
npm run test
```
