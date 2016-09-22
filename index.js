require('babel-register');

function istanbulHook() {
    var hook = require('istanbul').hook,
        myMatcher = function (file) {
          // console.log(file);
          return file.match(/foo/);
          // return true;
        },
        myTransformer = function (code, file) {
          return 'console.log("' + file + '");' + code;
        };

    hook.hookRequire(myMatcher, myTransformer);
}
function requireHook() {
  var oldHook = require.extensions['.js'];
  require.extensions['.js'] = function (mod, filename) {
    var oldCompile = mod._compile;
    mod._compile = function (code, filename) {
      console.log('called');
      oldCompile.call(mod, code, filename);
    }
    console.log('called');
    oldHook(mod, filename);
  }
}

// requireHook();
// istanbulHook();

require('./src/server');
