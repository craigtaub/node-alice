var esprima = require('esprima');
var escodegen = require('escodegen');
var Instrumenter = require('./alice-instrumenter');

function transform(code, filename) {
  var item = {options: {}};
  var instru = new Instrumenter(item, filename);

  // console.log('require file: ' , filename); // USEFUL
  // code = setup() + code;
  // console.log('full code' , code);

  return instru.instrumentSync(code.toString());
}

function requireHook() {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      if (!filename.match(/node_modules/) && !filename.match(/singleton/)) {
        var transformedCode = transform(code, filename);

        // console.log(code); // VERY USEFUL
        // console.log('---- TRANSFORM START-----');
        // console.log(transformedCode); // VERY USEFUL
        // console.log('---- TRANSFORM END-----');

      } else {
        var transformedCode = code;
      }
      // oldCompile.call(mod, code, filename);
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}
requireHook();

var file = process.argv[2]
require(file);
