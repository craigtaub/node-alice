var esprima = require('esprima');
var escodegen = require('escodegen');

function requireHook() {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      if (!filename.match(/node_modules/)) {

        var transformedCode = transform(code, filename);

        // console.log(transformedCode); // USEFUL
      } else {
        var transformedCode = code;
      }
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}
requireHook();

function printThis(filename, ranOne) {
    return esprima.parse('console.log(\'the middle\' , "' + filename + '" , ' + JSON.stringify(ranOne.toString()) + ' )')
}

function transform(srcCode, filename) {
  var parsed = esprima.parse(srcCode, {
  	loc: true, // Nodes have line and column-based location info
    range: true // Nodes have an index-based location range (array)
  });
  // console.log(parsed);
  var newParsed = Object.assign({}, parsed);
  newParsed.body = [];
  parsed.body.forEach(function(value, key) {

      var ranOne = escodegen.generate(value);
  		newParsed.body.push(esprima.parse('console.log(\'MAIN the middle\' , "' + filename + '" , ' + JSON.stringify(ranOne.toString()) + ' )'));
      newParsed.body.push(value);

      // declarative function:
      // function tree() {
      // }
      var run = newParsed.body.length/2;

      if (value.type === 'FunctionDeclaration' &&
        value.body && value.body.body.length > 0) {
        var ranOne = escodegen.generate(value);
        newParsed.body[key+run].body.body.unshift(printThis(filename, ranOne));
      }

      // for function arguments e.g:
      // get('/', function (req, res) {
      //     res.send('hello world');
      // });
      if (value.type === 'ExpressionStatement' &&
        value.expression &&
        value.expression.arguments) {
        value.expression.arguments.forEach(function(argValue, argKey) {

          if(argValue.body) {
            // add entire block (e.g. external file)
            var ranOne = escodegen.generate(value);
            newParsed.body[key+run].expression.arguments[argKey].body.body.unshift(printThis(filename, ranOne));
          }

        });
      }

      // variable declaration (or expression)
      // var callback = function (req, res) {
      //     res.send('hello world');
      // };
      if (value.type === 'VariableDeclaration' &&
        value.declarations &&
        value.declarations[0] &&
        value.declarations[0].init &&
        value.declarations[0].init.body &&
        value.declarations[0].init.body.body) {

        var ranOne = escodegen.generate(value);
        newParsed.body[key+run].declarations[0].init.body.body.unshift(printThis(filename, ranOne));
      }

      // IF statements
      // if (condition) {
      // consequent
      // } else {
      // alternate
      // }
      if (value.type === 'IfStatement') {
          var ranOne = escodegen.generate(value.test);
          newParsed.body.splice(
            key+run, // put before item
            0,
            printThis(filename, ranOne)
          )
          value.consequent.body.forEach(function(conditionValue, conditionKey) {
              var ranOne = escodegen.generate(conditionValue);
              newParsed.body[key+run+1].consequent.body.unshift(printThis(filename, ranOne)); // plus one as condition added above
          });
          if (value.alternate) {
            value.alternate.body.forEach(function(conditionValue, conditionKey) {
                var ranOne = escodegen.generate(conditionValue);
                newParsed.body[key+run+1].alternate.body.unshift(printThis(filename, ranOne));
            });
          }
      }

      if (value.type === 'ExpressionStatement' &&
        value.expression &&
        value.expression.right) {
        value.expression.right.body.body.forEach(function(expValue, expKey) {


          if (expValue.type === 'VariableDeclaration') {
              var ranOne = escodegen.generate(expValue);

              newParsed.body[key+run].expression.right.body.body.splice(
                expKey+1, // put before item
                0,
                printThis(filename, ranOne)
              )
          }
          if (expValue.type === 'IfStatement') {
          }
          if (expValue.type === 'ReturnStatement') {
          }

        });
      }

  });

  // console.log(newParsed);
  var newlyGeneratedCode = escodegen.generate(newParsed);
  // console.log(newlyGeneratedCode);
  return newlyGeneratedCode;
}

var filename = process.argv[2];
require(filename);
// require('./test');
// require('./server');
