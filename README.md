# Node Alice
Down the rabbit hole...

A tool which renders a visualization of the call stack during the entire lifetime of a request. Showing all parent<->child relationships following any nesting. Basically it shows every line of code executed during the request, and by what.

Any parent file it does not recognise (or running in a new tick) will be placed at the top level (i.e. Express/React/react-router/Promises etc) for now.

![alt tag](/imgs/analyser.png)

Alice defaults to just showing the file name to give the user the option to show/hide that files executed code.

![alt tag](/imgs/toggled.png)

## With Chrome Extension (much more fluid experience)

### Setup
1. npm install -g node-alice
2. // install chrome extension at ....
3. node-alice <your-entry-file>.js --with-ext --port:<some-free-port>

Without `--port` it will default to 8080. Any custom port set here must also be added into the Chrome Extension 'options' section.

### Usage
    1. // open your app in the browser
    2. // Click the Chrome Extension

You can immediately run a new request in the browser and the extension data will update when you open the Extension. Allowing for a much less clunky experience.

## Without the Chrome Extension

### Setup
    1. npm install -g node-alice
    2. node-alice <entry-file>.js

### Usage
    1. // open your app in the browser
    2. // turn the app off via <ctrl+c>
    3. open alice-analyser.html

## Features:
 - Toggle all file contents open/closed
 - Filter by any file name
 - Toggle filtered file name open/closed

## FAQ

    Why would I use this tool?

To help understand and learn (and perhaps debug) exactly what runs and from where with your application. Easily find any deep nesting and how often it is called. You can observe the code which is being run at run-time.

    What is the benefit over other server-side debuggers?

Of course tools like _iron-node_ and node debug can show you similar information, but Alice requires no code statements or additional/multiple clicking and produces an easy to read and follow tree in 1 click.


    Does it work if my app uses Babel?

As its storing exactly what code is executed, if you use a transpiler (e.g. Babel) it will show the post-compiled code.

If you used <b>babel-node CLI</b> you must define a _.babelrc_ or _"babel": {}_ block in your _package.json_ in order for node-alice to run. Without the correct _presets_ and _plugins_ your app wont work.

This is because node-alice uses a require-hook and babel checks up the tree for .babelrc (not down), so will not have any presets/plugins set for it. Help can be found https://babeljs.io/docs/usage/babelrc/.

    Some code seems to repeat, why?

Any use of iterations may print repetitive code, as it represents exactly what is run.

    Can I use it with Webpack?

Can be used with Webpack but only if the Node CLI command is run against the entry js file (ideally with the Chrome Extension).

## Bugs/feedback
Please feel free to create an [issue](https://github.com/craigtaub/node-alice/issues/new) or email me to let me know about any bugs you discover. I would appreciate any help. Thanks

## Comming Soon:
 - Stats section (longest call stack, number of new ticks, worse offender).
 - Add whitelist to recognise common parents (e.g. React/react-router/Express/Node/Promises)
