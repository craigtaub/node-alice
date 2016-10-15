# Node Alice
Down the rabbit hole...

## What is it?

A (node based) tool which renders an visualization of the call stack tree(s) during the entire lifetime of a request (e.g. `/home`)

Nested chains in the call stack get displayed in their nested chain. i.e.

![alt tag](/imgs/analyser.png)

It displays the file names and the exact lines of code (them and only them) which were executed.

![alt tag](/imgs/toggled.png)

Defaults to just showing the file name to give the user the option to show/hide a file names code.

## Why?
To help understand and learn (and perhaps debug) exactly what runs and from where with your application. You can observe the code running in real-time.

## Usage
    1. npm install -g node-alice
    2. node-alice <entry-file>.js
    3. // open your app in the browser
    4. // turn the app off via <ctrl+c>
    5. open alice-analyser.html

## Features:
 - Toggle all open or closed
 - Filter by file name
 - Toggle filtered file names open or closed

## Keep in mind
  1. Any parent file it doesnt recognise will be places at the top level (i.e. express/react/react-router etc.)
  2. Any use of iterations may print repetitive code, as it represents exactly what is run.
  3. Promises run in a new event tick so they will always appear at the top level.
  4. Can't really be used with Webpack, the CLI command must be run agains the entry js file.


## Using with Babel
As its storing exactly what code is executed, if you use a transpiler (e.g. Babel) it will show the post-compiled code.

If you used <b>babel-node CLI</b> you must define a _.babelrc_ or _"babel": {}_ block in your _package.json_ in order for node-alice to run. Without the correct _presets_ and _plugins_ your app wont work (as a side-note I find it important/useful to know what my applications uses from Babel anyway).

This is because node-alice uses a require-hook and babel checks up the tree for .babelrc (not down), so will not have any presets/plugins set for it. Help can be found https://babeljs.io/docs/usage/babelrc/.


## Future Feature:
 - Web Sockets so each new request can reload the "request call stack tree" page.

## Developing on the tool:

    #npm link node-alice
    #alias node-alice="node ./node_modules/node-alice/index"
    #node-alice entry-file.js
