var esprima = require('esprima');
var fs = require('fs');
var escope = require('escope');
var escodegen = require('escodegen');
// var esrecurse = require('esrecurse'); // not needed ??

// console.log(esprima.tokenize(program.toString()));


// SEEMS to NEED to be on same level as root file, locations relative.
var filename = './test.js';
// var filename = './server.js';
var srcCode = fs.readFileSync(filename);

var parsed = esprima.parse(srcCode.toString(), {
	loc: true, // Nodes have line and column-based location info
  range: true // Nodes have an index-based location range (array)
});
// parsed.body.unshift(esprima.parse('console.log(\'the start\')'));
// parsed.body.push(esprima.parse('console.log(\'the end\')'));


// ADD console.log after every line it finds
// var newParsed = Object.assign({}, parsed);
// newParsed.body = [];
// parsed.body.forEach(function(value, key) {
// 		newParsed.body.push(value);
// 		newParsed.body.push(esprima.parse('console.log(\'the middle\')'));
// });
// console.log(newParsed);


// Escope
// var analyzeAst = escope.analyze(ast);
// console.log(analyzeAst);


// Escodegen
// console.log(parsed.body.length);
// DOESNT seem to include dependencies in parsed code.
var newlyGeneratedCode = escodegen.generate(parsed);
// eval(newlyGeneratedCode);
// console.log(astAnalyst);
