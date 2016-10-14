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
 var nodeModules = 'node_modules';

 function buildHtml(body) {
   var header = '<h1>Alice Analyzer</h1>';

   return '<!DOCTYPE html><html>'
        + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">'
        + '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">'
        + '<header>' + header + '</header><body style="margin:20px;">' + body + '</body></html>';
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

         if ((!!parent.match(nodeModules) === true) ||
             (!!parent.match('emitTwo') == true) && (!!parent.match('events.js') == true) || // Node http
             (!!parent.match('Server.emit') == true) && (!!parent.match('events.js') == true) || // Node http
             (!!parent.match(value.filename) === true)) {
             stack.push(build(value));
         } else {
             return recurse(stack, value, parent);
         }
       }
     });

     return stack;
 }
 function recurse(stack, value, parent) {
   if (stack.length > 0 && stack[stack.length-1]) {
     if (!!parent.match(stack[stack.length-1].filename) === true) {
         stack[stack.length-1].children.push(build(value))
     } else {
         var currentItemChildren = stack[stack.length-1].children;
         return recurse(currentItemChildren, value, parent);
     }
   } else {
     stack.push(build(value)); // stack must be empty, push to new.
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

 // var coloursArray = {0: 'lightgreen', 10: 'lightblue', 20: 'orange', 30: 'lightgrey', 40: 'red'};
 function iterationContainer(value, nest) {
   var body = '';
   nest+= 10;
   value.forEach(function(value, key) {

     var backgroundColor;
     switch(nest) {
       case 0:
          backgroundColor = 'alert-success';
          break;
       case 10:
          backgroundColor = 'alert-warning';
          break;
       default:
          backgroundColor = 'alert-danger';
          break;
     }

    //  var backgroundColor = coloursArray[nest] || coloursArray[40];
     body+= '<div id="' + iterationIndex + '-parent">'; // background-color: ' + backgroundColor + ';border: solid black 2px; padding: 2px; margin-bottom: 20px;
        body+= '<div class="alert ' + backgroundColor + '" id="item-' + iterationIndex + '" style="margin-left: ' + nest + 'px">';
            body+= '<span><b>' + value.filename + ' </b></span>';
            // body+= ' [ <span onClick="toggleItem(\'item-' + iterationIndex + '-content\');">Toggle</span> ]';
            body+= '<button style="float: right; margin-top: -7px;" onClick="toggleItem(\'item-' + iterationIndex + '-content\');" type="button" class="btn btn-default">Toggle</button>'
            body+= '<div id="item-' + iterationIndex + '-content" style="display:none;">';
            value.contents.forEach(function(value, key) {
               body+= '<p>' + value + '</p>';
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
   body+='<script>function toggleAll(length) { for (var i = 0; i < length; i++ ) { toggleItem("item-" + i + "-content"); } }</script>';

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
 body+= '<ul class="list-group">';
 body+= '<h4>Filename Filter</h4>';
 // body+= '<span onClick="reset(' + leftIndex + ');">[ Reset ]</span>';
 body+= '<button onClick="reset(' + leftIndex + ');" type="button" class="btn btn-default">Reset</button>';
 for (var prop in listOfFilenames) {
     var values = listOfFilenames[prop];
     body+= '<li class="list-group-item">';
     body+= '<div style="padding: 2px;">';
       body+= '<span>' + prop + ' </span>';
      //  body+= ' [ <span onClick="toggleItems(' + leftIndex + ', ' + values.toString() + ');">Toggle</span> ]';
      body+= '<button style="float: right; margin-top: -7px;" onClick="toggleItems(' + leftIndex + ', ' + values.toString() + ');" type="button" class="btn btn-default">Toggle</button>'
     body+= '</div>';
     body+= '</li>';
 };
 body+= '</ul>';
 body+= '</div>';

 // Right hand list
 body+= '<div id="right-content" style="width: 70%; float: right;">';
 // body+= ' [ <span onClick="toggleAll(' + leftIndex + ');">Toggle All</span> ]';
 body+= '<button onClick="toggleAll(' + leftIndex + ');" type="button" class="btn btn-default">Toggle All</button>'


 // Iterate over object.
 var nest = -10;
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
