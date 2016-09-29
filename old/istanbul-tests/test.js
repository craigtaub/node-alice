var Instrumenter = require('./instrumenter');
var esprima = require("esprima");

var item = {options: {}};
var instru = new Instrumenter(item);
// var walker = instru.walker;
// var code = "var tree = 'my tree'; function tree() { return 'one' } var myParam = tree(); if(tree) { result = 'did run'; } else { result = 'did not run'; }";
// var code = 'function meaningOfLife() { return 42; }';
var code = require('./code');
var output = instru.instrumentSync(code.toString());
// var ast = esprima.parse(code.toString());
// var output = instru.instrumentASTSync(ast, 'filename.js', code.toString());
console.log(output);
// console.log(walker);
