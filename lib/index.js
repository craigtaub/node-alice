var esprima = require('esprima');
var escodegen = require('escodegen');

function requireHook() {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      if (!filename.match(/node_modules/)) {
      // if (filename === '/Users/craigtaub/Documents/javascript/basic-express/lib/test.js') {
      // if (filename === '/Users/craigtaub/Documents/javascript/basic-express/lib/server.js'
          // || filename === '/Users/craigtaub/Documents/javascript/basic-express/lib/routes.js') {
      // if (filename === '/Users/craigtaub/Documents/javascript/basic-express/lib/routes.js') {
        var transformedCode = transform(code, filename);
        // console.log(code);
        // console.log(transformedCode);
      } else {
        var transformedCode = code;
      }
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}
requireHook();

function transform(srcCode, filename) {
  var parsed = esprima.parse(srcCode, {
  	loc: true, // Nodes have line and column-based location info
    range: true // Nodes have an index-based location range (array)
  });
  // console.log(parsed);
  var newParsed = Object.assign({}, parsed);
  newParsed.body = [];
  parsed.body.forEach(function(value, key) {
      // console.log(value);
      var ranOne = escodegen.generate(value);
      // var ranOne = "var hello = 'tree'";
      // console.log('ran: ' , ranOne.toString());
  		newParsed.body.push(esprima.parse('console.log(\'the middle\' , "' + filename + '" , ' + JSON.stringify(ranOne.toString()) + ' )'));
      newParsed.body.push(value);

      // declarative function:
      // function tree() {
      // }
      var run = newParsed.body.length/2;
      if (value.body && value.body.body.length > 0) {
        newParsed.body[key+run].body.body.unshift(esprima.parse('console.log(\'the middle\' , "' + filename + '" , ' + JSON.stringify(ranOne.toString()) + ' )'));
      }

      // for function arguments e.g:
      // get('/', function (req, res) {
      //     res.send('hello world');
      // });
      if (value.expression && value.expression.arguments) {
        value.expression.arguments.forEach(function(argValue, argKey) {
          if(argValue.body) {
            newParsed.body[key+run].expression.arguments[argKey].body.body.unshift(esprima.parse('console.log(\'the middle\' , "' + filename + '" , ' + JSON.stringify(ranOne.toString()) + ' )'));
          }
        });
      }

      // function expression?
      // var callback = function (req, res) {
      //     res.send('hello world');
      // };
      if (value.declarations &&
        value.declarations[0] &&
        value.declarations[0].init &&
        value.declarations[0].init.body &&
        value.declarations[0].init.body.body) {

        newParsed.body[key+run].declarations[0].init.body.body.unshift(esprima.parse('console.log(\'the middle\')'));
      }

  });
  // console.log(newParsed);
  var newlyGeneratedCode = escodegen.generate(newParsed);
  // console.log(newlyGeneratedCode);
  return newlyGeneratedCode;
}

// require('./test');
require('./server');
