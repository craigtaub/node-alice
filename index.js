var Instrumenter = require('./instrumenter');
require('babel-register');

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
      code = code.replace(/require\('babel-register'\);/, ''); // strip any additional babel hooks
      if (!filename.match(/node_modules/) &&
          !filename.match(/singleton/) &&
          !filename.match(/processing/) &&
          !filename.match(/instrumenter/)) {
        var transformedCode = transform(code, filename);
      } else {
        var transformedCode = code;
      }
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}
requireHook();

var file = process.argv[2]
var currentDir = process.cwd();
require(currentDir + '/' + file);
