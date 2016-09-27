var parser = require("./parser");
var CoverajeRuntime = require("./Runtime");
var core = {
  options: {}
}
var runtime = new CoverajeRuntime(core);
// // console.log(parser.init)
var instance = {
  runtime: runtime,
  options: {
      resolveRequires: []
  }
}
//
var createdParser = parser.createParser(instance);
var code = require('../lib/test');

// var command = "const hello = 'tree';";
var output = createdParser.inject('code.toString()');
// // var output = createdParser.prepare(command);
// // var output = createdParser.walkAll(command, callback);
console.log(output);

// var Coveraje  = require('./core');
// var runner = {};
// var options = {};
// var inst = new Coveraje(command, runner, options);
//
// if (inst.isInitialized) {
//     if (typeof onComplete === "function") {
//         inst.onComplete(onComplete);
//     }
//     if (typeof onError === "function") {
//         inst.onError(onError);
//     }
//     runInConsole(options, inst);
// }
