
run: node lib/index.js

== what?
PRODUCT:
- run a request, creates html page with diagram of files + code within that file.
- visual representation of request.
- easier to follow/read.

like dynamic program slicing.
- input and told exactly what runs.

runtime dependency tree?
stack traces/call stack?
- dont think it is as will give details of whats called that line...the chain of dependencies, not the app.
static analysis?

===


== plugin
npm link                    
# creates global link

npm link babel-plugin-craig-test              
# link-install the package
==


== Process:
at runtime (for a request):
via a hook. build AST. parse into html file.
#craig-node file.js
#open my-route.html -> think istanbul can help with that..

if istanbul can build+parse when runs a test, why cant do it for a request/supertest?
require-hooks can help, BUT they only run when modules imported, at build-time..
SO:
how do unit tests do it? does each unit test run completely fresh?
each unit test much run everything??
==

== Istanbul notes
"Module loader hooks to instrument code on the fly."

- takes js program and passes it through Esprima to get the syntax tree.
- Then injects some instrumentation by wrapping various syntax constructs
- After that, a new js program is generated from the syntax tree by using Escodegen.
- when the program runs, the injected annotation is also executed accordingly and thereby the statistics of the program execution can be gathered.

https://ariya.io/2012/12/javascript-code-coverage-with-istanbul
===

== Istanbul internals
Esprima for AST (parser)
http://esprima.org/doc/index.html
http://sevinf.github.io/blog/2012/09/29/esprima-tutorial/
http://tobyho.com/2013/12/02/fun-with-esprima/
- token (lexical analysis, the tokens)
- parse (syntactic analysis, parses tokens into X)

Escodegen can parse AST (code generator):
- js -> AST -> js

Escope https://github.com/estools/escope can parse AST (code generator):
- can it do it at runtime? only build-time. ????
===

== Istanbul hook
http://gotwarlost.github.io/istanbul/public/apidocs/classes/Hook.html
- hookRequire "hooks `require` to return transformed code to the node module loader."
-- same as require hook, doesnt work at runtime tho.
-- https://github.com/gotwarlost/istanbul/blob/master/lib/hook.js
===


== Require hook:
// grab old .js ext function
var oldHook = require.extensions['.js'];
// set new .js ext function to X
require.extensions['.js'] = function (mod, filename) {
  var oldCompile = mod._compile;
  // cache the actual compile implementation

  mod._compile = function (code, filename) {
    // re-compile code based on something here.
    // ..
    oldCompile.call(mod, code, filename);
    // compile again
  }
  // now run old function
  oldHook(mod, filename);
}
===



=== Babel CLI:
#babel index.js --out-file app.js
===

== Node Simple Profile:
https://nodejs.org/en/docs/guides/simple-profiling/
#NODE_ENV=production node --prof index.js   
#node --prof-process isolate-0x102004a00-v8.log > log.txt
- does print files but its also compiled so cant follow.
- what about if in ES5?
===

== Babel's Babylon:
https://github.com/babel/babylon
==

== native Error Stack:
var stack = new Error().stack
console.log( stack )
- not helpful, its the current location and what called it..
==

http://www.chromium.org/developers/how-tos/trace-event-profiling-tool
