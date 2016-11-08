#!/usr/bin/env node

var Instrumenter = require('./instrumenter');

function createAliceServer() {
  var serverPort;
  if (process.argv[4]) {
    serverPort = process.argv[4];
    serverPort = serverPort.replace('--port:', '');
  } else {
    serverPort = 8080;
  }

  var processor = require('./processing');
  var singleton = require('./singleton');
  var http = require('http');

  http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.write(JSON.stringify(singleton.getAll()));
    singleton.setReset(); singleton.clearAll();

    response.end();
  }).listen(serverPort);
}

require('babel-register');

function transform(code, filename, withExtension) {
  var item = {options: {}};
  var instru = new Instrumenter(item, filename, withExtension);

  return instru.instrumentSync(code.toString());
}

function requireHook(withExtension) {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      code = code.replace(/require\('babel-register'\);/, ''); // strip any additional babel hooks
      if (!filename.match(/node_modules/) &&
          !filename.match(/singleton/) &&
          !filename.match(/processing/) &&
          !filename.match(/instrumenter/)) {
        var transformedCode = transform(code, filename, withExtension);
      } else {
        var transformedCode = code;
      }
      oldCompile.call(mod, transformedCode, filename);
    }
    oldHook(mod, filename);
  }
}

var withExtension = (process.argv[3] === '--with-ext') ? true : false;

if (withExtension) {
  createAliceServer();
}
requireHook(withExtension);

var file = process.argv[2]
var currentDir = process.cwd();
require(currentDir + '/' + file);
