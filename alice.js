var esprima = require('esprima');
var escodegen = require('escodegen');
var Instrumenter = require('./alice-instrumenter');
var currentDirectory = __dirname;


function transform(code, filename) {
  var item = {options: {}};
  var instru = new Instrumenter(item, filename);

  console.log('require file: ' , filename); // USEFUL
  code = setup() + code;
  console.log('full code' , code);

  return instru.instrumentSync(code.toString());
}


var writeFile = function(jsonBlob) {
  // var fs = require('fs');
  // console.log('WRITE FILE', jsonBlob);

  // var body = '';
  //
  // for (var key in jsonBlob) {
  //     body+= '<div>';
  //     body+= '<p>Filename: ' + key + '</p>';
  //     jsonBlob[key].forEach(function(value, key) {
  //       body+= '<p>Contents: ' + value + '</p>';
  //     });
  //
  //     body+= '</div>';
  // };
  //
  // fs.writeFileSync(currentDirectory + '/analysis.html', buildHtml(body));


  // function buildHtml(body) {
  //   var header = 'Some Header';
  //
  //   return '<!DOCTYPE html>'
  //        + '<html><header>' + header + '</header><body>' + body + '</body></html>';
  // };
}

function setup() {
  return 'var writeFile=' + writeFile + '; var currentDirectory="' + currentDirectory + '"; var singleton = require(currentDirectory + \'/singleton\'); process.on(\'exit\', function() { writeFile(singleton.getAll()); process.exit(); }); ';
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
