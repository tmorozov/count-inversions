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

function mergeInversions(res1, res2) {
  var res = {
    arr: [],
    count: res1.count + res2.count
  };

  var i1 = 0;
  var i2 = 0;
  var len1 = res1.arr.length;
  var len2 = res2.arr.length;
  var len = len1+len2;
  var i;
  var arr1 = res1.arr;
  var arr2 = res2.arr;
  
  for (i=0; i<len; i++) {
    if (i1 >= len1) {
      res.arr[i] = arr2[i2];
      i2++;
      continue;
    }
    if (i2 >= len2) {
      res.arr[i] = arr1[i1];
      i1++;
      continue;
    }
    if (arr1[i1] <= arr2[i2]) {
      res.arr[i] = arr1[i1];
      i1++;
    } else {
      res.arr[i] = arr2[i2];
      i2++;
      res.count += len1 - i1;
    }
  }
  return res;
}

function recursiveInversions(arr) {
  if (arr.length === 1) {
    return {
      arr: arr,
      count: 0
    };
  }
  
  // count left
  var res1 = recursiveInversions(arr.splice(0, ~~(arr.length/2)));
  // count right
  var res2 = recursiveInversions(arr);
  // merge
  return mergeInversions(res1, res2);
}

function recursiveInversionsWrapper(arr) {
  console.log('using recursice');
  return  recursiveInversions(arr).count;
}

function bruteForceInversions(arr) {
  console.log('using brute');
  var i;
  var j;
  var len = arr.length;
  var len_1 = len - 1;
  if (len<2) {
    return 0;
  }

  var count = 0;
  for(i=0; i<len_1; i++) {
    for(j=i+1; j<len; j++) {
      if (arr[i] > arr[j]) {
        count++;
      }
    }
    if (i%1000 === 0) {
      console.log(i/1000+'K', count);
    }
  }
  return count;
}

var countInversions = function (arr, useBrute) {
  if (useBrute) {
    return bruteForceInversions(arr);
  }
  return recursiveInversionsWrapper(arr);
}

if(require.main == module) {
  program
    .option('-f, --file <file>', 'Path to file with data', clone(assertFileExists), INPUT_FILE_DEFAULT)
    .option('-b, --brute ', 'use brute force')
    .parse(process.argv);

  var arr = loadArray(program.file);
  var result = countInversions(arr, program.brute);
  console.log('Result: ', result);

} else {
    exports.checkHtmlFile = countInversions;
}
