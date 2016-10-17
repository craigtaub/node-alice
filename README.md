# Node Alice
Down the rabbit hole...

A tool which renders a visualization of the call stack during the entire lifetime of a request. Showing all parent<->child relationships following any nesting. Basically it shows every line of code executed during the request, and by what.

Any parent file it does not recognise (or running in a new tick) will be placed at the top level (i.e. Express/React/react-router/Promises etc) for now.

![alt tag](/imgs/analyser.png)

Alice defaults to just showing the file name to give the user the option to show/hide that files executed code.

![alt tag](/imgs/toggled.png)

## Usage
    1. npm install -g node-alice
    2. node-alice <entry-file>.js
    3. // open your app in the browser
    4. // turn the app off via <ctrl+c>
    5. open alice-analyser.html

## Why?
To help understand and learn (and perhaps debug) exactly what runs and from where with your application. Easily find any deep nesting and how often it is called. You can observe the code which is being run at real-time.

Of course server-side debuggers (e.g. _iron-node_, node debug) can show you similar information, but node-alice requires no code statements or additional clicking and produces an easy to read and follow tree. You can jump straight to the area you are interested in.

## Features:
 - Toggle all file contents open/closed
 - Filter by any file name
 - Toggle filtered file name open/closed

## Does your application use Babel?
As its storing exactly what code is executed, if you use a transpiler (e.g. Babel) it will show the post-compiled code.

If you used <b>babel-node CLI</b> you must define a _.babelrc_ or _"babel": {}_ block in your _package.json_ in order for node-alice to run. Without the correct _presets_ and _plugins_ your app wont work (as a side-note I find it important/useful to know what my application uses from Babel anyway).

This is because node-alice uses a require-hook and babel checks up the tree for .babelrc (not down), so will not have any presets/plugins set for it. Help can be found https://babeljs.io/docs/usage/babelrc/.

## Keep in mind
  1. Any use of iterations may print repetitive code, as it represents exactly what is run.
  2. Can't really be used with Webpack, the CLI command must be run against the entry js file.

## Bugs
Please feel free to create an issue or email me to let me know about any bugs you discover. I would appreciate any help. Thanks

## Future features:
 - Add a Stats section (longest call stack, number of new ticks, worse offender).
 - Web Sockets so each new request can reload the "request call stack tree" page.
 - Add whitelist to recognise common parents (React/react-router/Express/Node/Promises)
