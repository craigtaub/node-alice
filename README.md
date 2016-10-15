# Node Alice
Down the rabbit hole...

## What is it?

A (node based) tool which renders an visualization of the call stack tree(s) during the entire lifetime of a request (e.g. `/home`)

Nested chains in the call stack get displayed in their nested chain. i.e.

![alt tag](/imgs/analyser.png)

It displays the file names and the exact lines of code (them and only them) which were executed.

![alt tag](/imgs/toggled.png)

Defaults to just showing the file name to give the user the option to show/hide a file names code.

## Example Usage

![alt tag](/imgs/example-usage.gif)

## Why?
To help understand and learn (and perhaps debug) exactly what runs and from where with your application. You can observe the code running in real-time.

## Usage
    1. node-alice <entry-file>.js
    2. // open your app in the browser
    3. // turn the app off via <ctrl+c>
    4. open node-alice.html

## Using with Babel
If you used babel-node CLI you must define a .babelrc or "babel": {} block in your package.json in order for node-alice to run. Without the correct presets and plugins your app wont work. As a side-note I find it important to know what my applications use from Babel anyway.

This is because node-alice uses a require-hook and babel checks up the tree for .babelrc (not down), so will not have any presets/plugins set for it. Help can be found https://babeljs.io/docs/usage/babelrc/.

## Using a Transpiler
As its storing exactly what code is executed, if you use a transpiler (e.g. Babel) it will show the post-compiled code.

## Keep in mind
  1. Any parent it doesnt recognise will be places at the top level (i.e. express/react/react-router etc.)
  2. Any use of iterations may print repetitive code, as it represents exactly what is run.
  3. Promises run in a new event tick so they will always appear at the top level.
  4. Can't really be used with Webpack, the CLI command must be run agains the entry js file.

## Features:
 - Toggle all open or closed
 - Filter by file name
 - Toggle filtered file names open or closed

## Future Feature:
 - Web Sockets so each new request can reload the "request call stack tree" page.

## Developing on the tool:

    #npm link node-alice
    #alias node-alice="node ./node_modules/node-alice/index"
    #node-alice entry-file.js
