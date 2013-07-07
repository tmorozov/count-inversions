#!/usr/bin/env node

var fs = require('fs');
var program = require('commander');
var INPUT_FILE_DEFAULT = "IntegerArray.txt";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var loadArray = function (fileName) {
  var data = fs.readFileSync(fileName).toString();
  return data.split("\n").filter(function (item) {
    return !!item.length
  }).map(function(item) {
    return ~~item;
  });
}

var countInversions = function (arr) {
console.log(arr[0]);
console.log(arr[arr.length-1]);
  return arr.length;
}

if(require.main == module) {
  program
    .option('-f, --file <file>', 'Path to file with data', clone(assertFileExists), INPUT_FILE_DEFAULT)
    .parse(process.argv);

  var arr = loadArray(program.file);
  var result = countInversions(arr);
  console.log(result);

} else {
    exports.checkHtmlFile = countInversions;
}
