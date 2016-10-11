# Node Alice
Down the rabbit hole you go...

## What is it?

A (node based) tool which renders an interactive visualization of the call stack tree(s) during the lifetime of an entire Request (e.g. `/home`)

Nested chains in the call stack get displayed in their nested chain.
i.e. 

    file-a 
    - contents
        file-a.b
        - contents
            file-a.c
            - contents
        file-a.b
        - contents
    file-b
    - contents
    file-c
    ...
    
It displays the file names and the exact lines of code (them and only them) which were executed.
Defaults to just showing the filename to give the user the option to show/hide a file names code.

## Example Usage

![alt tag](/example-usage.gif)

## Why?
To help understand and learn (and perhaps debug) exactly what runs and from where with your application. You can observe the code running in real-time.

## Usage
    1. node-alice <entry-file>.js
    2. // open your app in the browser
    3. // turn the app off via <ctrl+c>
    4. open node-alice.html

## Features:
 - Toggle all open or closed 
 - Filter by filename
 - Toggle filtered filenames open or closed
 
## Future Feature:
 - Web Sockets so each new request can reload the "request call stack tree" page.
