var esprima = require('esprima');
var escodegen = require('escodegen');

var Instrumenter = require('./instrumenter');


function transform(code, filename) {
  var item = {options: {}};
  var instru = new Instrumenter(item, filename);

  return instru.instrumentSync(code.toString());
}

function requireHook() {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      if (!filename.match(/node_modules/) && !filename.match(/singleton/)) {
        var transformedCode = transform(code, filename);

        // console.log('---- TRANSFORM START-----');
        // console.log(transformedCode); // VERY USEFUL
        // console.log('---- TRANSFORM END-----');
        
      } else {
        var transformedCode = code;
      }
      // console.log('transformed: ' transformedCode);
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}
requireHook();

var file = './app';
require(file);
