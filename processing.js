function aliceTrackerStatement(filename, node) {
   filename = filename.replace(process.cwd(), ''); // remove entire path
   filename = filename.replace(/^\/|\/$/g, ''); // remove and leading slash

   var getStack = '(function() { try { throw new Error(); } catch(e) { return e.stack; } })().toString()';
   return 'singleton.add("'+ filename+ '", '+ JSON.stringify(node.toString()) + ', ' + getStack + ');';
   // return 'console.log("'+ filename+ '", '+ JSON.stringify(node.toString()) +');';
}

var currentDirectory = __dirname;

var writeFile = function(fileAndContents) {
 var fs = require('fs');
 var expressCaller = 'express/lib/router/layer.js';
 // console.log('WRITE FILE', fileAndContents); // FOR DEBUGGING

 function buildHtml(body) {
   var header = '<h1>Alice Analyzer</h1>';

   return '<!DOCTYPE html>'
        + '<html><header>' + header + '</header><body>' + body + '</body></html>';
 };

 // Rebuild object into nested call stack format.
 function reformat(obj) {
     var stack = [];

     obj.forEach((value, key) => {
       if (stack.length === 0) {
           stack.push(build(value));
       } else {
         var stackArray = value.stack.split('\n');
         var parent = stackArray[3].trim();
         if (!parent.match('.js:') === true) { // its a command not a file, try next one.
             parent = stackArray[4].trim();
         }

         if (!!parent.match(expressCaller) === true) {
             stack.push(build(value));
         } else {
             return recurse(stack, value, parent);
         }
       }
     });

     return stack;
 }
 function recurse(stack, value, parent) {
   if (stack[stack.length-1]) {
     if (!!parent.match(stack[stack.length-1].filename) === true) {
         stack[stack.length-1].children.push(build(value))
     } else {
         var currentItemChildren = stack[stack.length-1].children;
         return recurse(currentItemChildren, value, parent);
     }
   }
 }
 function build(value) {
   return {
     filename: value.filename,
     contents: value.contents,
     children: []
   }
 }

 function buildFilterIteration(array) {
    array.forEach(function(value, key) {
        if (!listOfFilenames[value.filename]) {
          listOfFilenames[value.filename] = [];
          listOfFilenames[value.filename].push(leftIndex);
        } else {
            listOfFilenames[value.filename].push(leftIndex);
        }
        leftIndex++;
        if (value.children.length > 0) {
            buildFilterIteration(value.children);
        }
    })
 }

 function iterationContainer(value, nest) {
   var body = '';
   nest+= 10;
   value.forEach(function(value, key) { // key.toString()
     body+= '<div id="' + iterationIndex + '-parent"  style="">';
        body+= '<div id="item-' + iterationIndex + '" style="border: solid black; margin-bottom: 40px; margin-left: ' + nest + 'px">';
            body+= '<span>Filename: ' + value.filename + '</span>';
            body+= ' [ <span onClick="toggleItem(\'item-' + iterationIndex + '-content\');">Toggle</span> ]';
            body+= '<div id="item-' + iterationIndex + '-content" style="display:none;">';
            value.contents.forEach(function(value, key) {
               body+= '<p>Contents: ' + value + '</p>';
            });
            body+= '</div>';
        body+= '</div>';
        iterationIndex++;
        if (value.children.length > 0) {
            body+= iterationContainer(value.children, nest);
        }
     body+= '</div>';
   });

   return body;
 }

 function setupFunctions(body) {
   // all use
   body+='<script>function toggle(element) { if (element && element.style) { element.style.display = element.style.display === "none" ? "" : "none"; }}</script>';
   body+='<script>function reset(length) { for (var i = 0; i < length; i++ ) { if (document.getElementById("item-" + i)) { document.getElementById("item-" + i).style.display = ""; }} }</script>';

   // right hand side
   body+='<script>function toggleItem(theId) { var theElement = document.getElementById(theId); toggle(theElement); }</script>';
   body+='<script>function toggleAll() { for (var i = 0; i < document.getElementById("right-content").children.length; i++ ) { var item = document.getElementById("item-" + i + "-content"); if (item && item.style) { toggle(item); }}}</script>';

   // left hand side
   body+= '<script>function toggleItems() { reset(); var args = [].slice.call(arguments); var length = args[0]; args.shift(); toggleParents(length, args); }</script>';
   body+= '<script>function toggleParents(length, itemArray) { for (var i = 0; i < length; i++ ) { if(itemArray.indexOf(i) === -1) { toggleItem("item-" + i); } } }</script>';

   return body;
 }

 var body = '';

 // Reformat Data
 // console.log('-----fileAndContents-----');
 // console.log(fileAndContents);
 var newFileAndContents = reformat(fileAndContents);
 // console.log('-----newFileAndContents-----');
 // console.log(newFileAndContents);

 // setup function
 body+= setupFunctions(body);

 // Build array for left hand list
 var listOfFilenames = {};
 var leftIndex = 0;
 // iterate over new data as not always accurate using old set.
 buildFilterIteration(newFileAndContents);

 // Left hand list
 body+= '<div id="left-content" style="width: 27%; float: left; word-wrap: break-word;">';
 body+= '<span>Filename Filter</span> <span onClick="reset(' + leftIndex + ');">[ Reset ]</span>';
 for (var prop in listOfFilenames) {
     var values = listOfFilenames[prop];
     body+= '<div style="border: solid black;margin-bottom: 40px;">';
       body+= '<span>' + prop + '</span>';
       body+= ' [ <span onClick="toggleItems(' + leftIndex + ', ' + values.toString() + ');">Toggle</span> ]';
     body+= '</div>';
 };
 body+= '</div>';

 // Right hand list
 body+= '<div id="right-content" style="width: 70%; float: right;">';
 body+= ' [ <span onClick="toggleAll();">Toggle All</span> ]';


 // Iterate over object.
 var nest = 0;
 var iterationIndex = 0;
 body+= iterationContainer(newFileAndContents, nest);
 body+= '</div>';

 fs.writeFileSync(process.cwd() + '/node-alice.html', buildHtml(body));
}

function setup() {
  // exit -> normal // -TEST
 //  return 'var writeFile=' + writeFile + '; var currentDirectory="' + currentDirectory + '"; var singleton = require(currentDirectory + \'/singleton\'); process.on(\'exit\', function() { writeFile(singleton.getAll()); process.exit(); }); //setTimeout(function() { singleton.clearAll(); }, 100);';
  // SIGINT -> closed server // -SERVER
  return 'var writeFile=' + writeFile + '; var currentDirectory="' + currentDirectory + '"; var singleton = require(currentDirectory + \'/singleton\'); if (!singleton.getListener()) { process.on(\'SIGINT\', function() { writeFile(singleton.getAll()); process.exit(); }); singleton.setListener(); } setTimeout(function() { if(!singleton.getReset()) { singleton.setReset(); singleton.clearAll(); } }, 100);';
}

exports.setup = setup;
exports.aliceTrackerStatement = aliceTrackerStatement;
