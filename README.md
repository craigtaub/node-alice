
## Usage
    1. node-alice <entry-file>.js
    2. // open your app in the browser
    3. // turn the app off via <ctrl+c>
    4. open node-alice.html

## what?
- run a request, creates html page with diagram of files + code within that file.
- visual representation of request.
- easier to follow/read.

like dynamic program slicing.
- input and told exactly what runs.

runtime dependency tree?
stack traces/call stack?
- dont think it is as will give details of whats called that line...the chain of dependencies, not the app.
static analysis?


## Notes:
- all via require hooks
- parsed and instrumented
- stores via module SINGLETON as each file was getting own global={}
- Promises:
  - print as 1 long line as thats how they execute...but then runs code after.
- executing iterations will show unless they are 1 liners


## TODO:
- UI Call Stack: nest the nested calls via padding
 - ONLY BASIC THO. possible as check if next===previous and previous not already indented. if deep nested cant really know.
 - TRIED catching if CallExpression (execute function) or arguments.callee both didnt work.
 - SO get error trace for each line and parse where called from.
 - BUT need to keep top level ones top, know how much padding its gone through if no match..CANT all it knows if current item called or not..  
 - BUT if not error OR ???
- parse json file and write to html with js to expand/collapse - HALF
 - maybe flow chart with arrows back and forward - too many installs.
 - ui with right entire stack, all or expand/collapse per item..left, expand/collapse per filename (should also hide others in those instances)
 - make look good..twitter bootstrap list view
- Only show filename path from application root not computer root - DONE
- load HTML file in app dir not node-alice - DONE
- give value of certain properties, like debugger does, its live. - FAILED
 - dont think possible has to execute as sometimes LONG value as string and errors when executes.
- fix statements which arent useful - DONE
 - removed line in coverFunction as seems to print function.
 - removed blocks in { }
 - removed extra stringify
- implement singleton tracker instead of console.log everywhere - DONE
- MAYBE swap to istanbul technique for flagging line numbers so doesnt use compiled code, pre-compiled code, but knows from line number

## try on real app 'node ./node_modules/node-alice/alice /server.js'
 - runs alot more code than it should??
   - THINK it includes what Jade executes, which is good.
 - account wont work with 'babel-register' set ???
   - not presets, hook doesnt open launch.js file
    - WORKS when i move alice/instrumenter/singleton into work app folder...think issue with location...WHY?
    - FAILS: node ./node_modules/node-alice/alice /server.js
    - WORKS: node alice.js /src/index.js
    - actual require-hook not running for app files.
    - IF located anywhere in app its fine, IF outside app OR local node_modules wont work.
    - require.extension is actually deprecated, babel relies on nodes deprecated feature.
    - FIX stripped any babel-register hooks as app doesnt need it and causes problems
    - WHY think local babel-register overrides alice one IF alice one in node_modules. ??
 - set SIGINT listener each time, need to check before i set
   - think can up listeners or reset them each time..if not just heavy but still works
    - cant need 'process.setMaxListeners(0);' so can do infinite, BAD THO.
    - SOLVED using singleton again.
 - BUG blog requires no setTimeout ?? should instrument 1st time, execute second time.
  - app starts and adds alot, reset should be fine..
  - IF require inline WILL lose data as calls setTimeout at top to clear code..
  - FIXED by using singleton to set when has reset.
  - ELSE have to dis-allow apps using inline requires..

## DONE
- fix statements which arent useful - DONE removed line in coverFunction as seems to print function.
- fix console logs - DONE fix is branchIncrementExprAst
- iteration - when a loop prints code block X number of times...nasty although correct. need to only print line once if matches previous line exactly.
 - fixed with previousContent
- babel syntax / allow ES6 (espirma works with ES6) - BAD (CANT FIX)
 - require-hook not babel-node
 - might need some updates for exports/imports etc but should work
 - 'babel-node' -> works but post babel
 - 'node' -> wont work unless require('babel-register') before and then
  produces es5 code.
   - WHY: require-hook works on requires, before babel they are imports, node does not know to run the hook. so doesnt..only after babel has run does it run hook on other files.
 - BUT how does Istanbul do it then?
   - when use its Instrumenter it instruments es5.
    - when use instrument command ('istanbul instrument') has issues with es6 imports/exports
  - SO ONLY issue with es6 is modules...mocha doesnt show imports as at build-time etc and inline requires work due to hook...what if istanbul mocha ignores the import code and shows everything else???
  - YES. istanbul shows es6 import/export BUT doesnt flag as ran...regardless how use export (import always same way)
  - ALSO it flags the run line numbers of the function so compares that against real code, not transformed code.
- BUG why prints import if only running whats executing?
 - its a singleton so stores as time goes on. needs to add to call handler at transform time as doesnt know if request. can reset in middleware but need to attach that to router..SO after 100ms of build it resets.. - DONE
- bundling calls together, need listed separately - DONE
- make cli tool - DONE...node analyse.js my-entry-file.js
 - could improve into 'analyse my-entry-file.js' creating node-cli package.
- write to global and shutdown handler writes to file - DONE
 - using 'close' and 'exit' both dont run if user terminates..must be SIGTERM
- find something to help instrumenting...flexible instrument but write when their does - DONE
 - tried istanbul commands, hooks + babel plugins...nothing
 - Istanbul parser works i think
- implement singleton into new parser - DONE
 - make sure adds setup in AST NOT in code string, so we dont get coverage of the setup code...why it cant go in alice.js and must be instrumenter.js
- get prototype working with routes+calculations all showing for that request... - DONE

### low priority..i know its possible
- fix
 - modules (import not needed, just code inside export)
 - function calls. e.g. guy()
 - nested: all
 - functions e.g. with assigns or if's need to not be added in 1 blob, need individual items

- allow recursive checks of ALL types...For nested.
i.e. can hand object prop into function checking for IF, EXPORT, etc...

- Dont print if is nested


## Old notes:
- iterate over original value, not new...as writing to new and messes up forEach.
- what splice need keys to follow (real location after instrumenting): 0==0, 1==2, 2==4
- nested only needs to work for each file as require-hook will treat each file/dep as top level.


## Testing
/node-alice
npm link

/account
npm link node-alice

./node_modules/node-alice ./server.js
- basic, work, blog


## Research

### developing off parsed AST
code into http://esprima.org/demo/parse.html
- put statement in so can see where it should be appended dynamically.

http://babeljs.io/repl/
- paste AST object and play with appending

SHOULD be checking for 'type' first.

### Process:
at runtime (for a request):
via a hook. build AST. parse into html file.

`craig-node file.js`

`open my-route.html -> think istanbul can help with that..`

if istanbul can build+parse when runs a test, why cant do it for a request/supertest?
require-hooks can help, BUT they only run when modules imported, at build-time..
SO:
how do unit tests do it? does each unit test run completely fresh?
each unit test much run everything??

### Require hook:
what istanbul + babel rely on. Hook into all file opens, transform into require cache, so when its run it runs transformed code.


### Istanbul notes
"Module loader hooks to instrument code on the fly."

- takes js program and passes it through Esprima to get the syntax tree.
- Then injects some instrumentation by wrapping various syntax constructs
- After that, a new js program is generated from the syntax tree by using Escodegen.
- when the program runs, the injected annotation is also executed accordingly and thereby the statistics of the program execution can be gathered.

https://ariya.io/2012/12/javascript-code-coverage-with-istanbul


### Istanbul internals
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


### Istanbul hook
http://gotwarlost.github.io/istanbul/public/apidocs/classes/Hook.html
- hookRequire "hooks `require` to return transformed code to the node module loader."
-- same as require hook, doesnt work at runtime tho.
-- https://github.com/gotwarlost/istanbul/blob/master/lib/hook.js


### Istanbul instrument command
`istanbul instrument lib/ -o test-intrument/`

instruments file/folder into new file/folder. need to execute after.
works but need options to specify intrumenting into what, does it to coverage-like

can change --variable and --hook-run-in-context but doesnt help.


### babel plugin, locally in .babelrc
`,"plugins": ["./plugin/index.js"]`


### plugin linking (not needed)
npm link                    
`creates global link`

npm link babel-plugin-craig-test              
`link-install the package`


### Babel CLI:
`babel index.js --out-file app.js`


### Node Simple Profile:
https://nodejs.org/en/docs/guides/simple-profiling/
`NODE_ENV=production node --prof index.js`   
`node --prof-process isolate-0x102004a00-v8.log > log.txt`
- does print files but its also compiled so cant follow.
- what about if in ES5?

### Babel's Babylon:
https://github.com/babel/babylon

### native Error Stack:
`var stack = new Error().stack`
`console.log( stack )`
- not helpful, its the current location and what called it..

http://www.chromium.org/developers/how-tos/trace-event-profiling-tool
