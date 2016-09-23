var esprima = require('esprima');
var escodegen = require('escodegen');

function requireHook() {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      var transformedCode = transform(code);
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}
requireHook();

function transform(srcCode) {
  var parsed = esprima.parse(srcCode, {
  	loc: true, // Nodes have line and column-based location info
    range: true // Nodes have an index-based location range (array)
  });
  var newParsed = Object.assign({}, parsed);
  newParsed.body = [];
  parsed.body.forEach(function(value, key) {
  		newParsed.body.push(value);
  		newParsed.body.push(esprima.parse('console.log(\'the middle\')'));
  });
  // console.log(newParsed);
  var newlyGeneratedCode = escodegen.generate(newParsed);
  // console.log(newlyGeneratedCode);
  return newlyGeneratedCode;
}

// require('./test');
require('./server');
