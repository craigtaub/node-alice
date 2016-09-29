var codeDep = require('./code-dep')

module.exports = function tree(){

    var tree = 'my tree';

    if(tree) {
    // if (true) {
      result = 'did run';
    } else {
      result = 'did not run';
    }
    //
    return 'friend: ' + codeDep();
};
