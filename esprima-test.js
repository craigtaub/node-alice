var esprima = require('esprima');
var fs = require('fs');
var escope = require('escope');
var escodegen = require('escodegen');

// console.log(esprima.tokenize(program.toString()));

// var filename = './test.js';
var filename = './lib/server.js';
var srcCode = fs.readFileSync(filename);

var ast = esprima.parse(srcCode.toString(), {
	loc: true, // Nodes have line and column-based location info
  range: true // Nodes have an index-based location range (array)
});

// console.log(ast.body);

// Escope
// var analyzeAst = escope.analyze(ast);
// console.log(analyzeAst);

// Escodegen
var astAnalyst = escodegen.generate(ast);
console.log(astAnalyst);
