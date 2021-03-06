"use strict";
/*
This is a NODE JS script that will convert all less files
within a project to css files. The css files will be added
to the same location as the less file resides.

You can tell the script to ignore certain folders by
adding them to the string array below


//////////////////////////////////////
//To Run this Script

// Assuming the script is inside a folder called "compiler-scripts" off your root project directory.
// At a command prompt type

node ./compiler-scripts/less-compiler-script.js



*/
const path = require('path');
const fs = require('fs');
const less = require('less');
// make sure these are all lower case
let FoldersToIgnore = [
    "node_modules"
];
class LessFile {
    constructor(FileNameAndPath) {
        this.fileNameAndPath = FileNameAndPath;
        this.fileNameWithoutExtention = this.FindFileName_WithoutExtention(FileNameAndPath);
        this.PathToFile = this.FindFilePath(FileNameAndPath);
    }
    ConvertFileToCSS() {
        // file the less file into memory
        var fileContent = fs.readFileSync(this.fileNameAndPath).toString();
        // convert the less file to css string
        less.render(fileContent, { compress : true }, (e, css) => {
            // create a new file (or overwrite existing file) with css we have created
            fs.writeFile(this.fileNameWithoutExtention + '.css', css.css, (err) => {
                console.log("created : " + this.fileNameWithoutExtention + '.css');
            });
        });
    }
    FindFileName_WithoutExtention(file) {
        return file.substring(file.lastIndexOf("/"), file.lastIndexOf('.'));
    }
    FindFilePath(file) {
        return file.substring(0, file.lastIndexOf("/"));
        ;
    }
}
// an array to fold the location of all the *.less files we find
let LessFilesArray = Array();
// get the location of where the node command is being run from (this is hopefully the root folder of the project)
let baseDirectory = process.cwd();
// do a recersive search looking for all less files starting at project base
LookInsideFolder(baseDirectory);
// run the less compiler on all the *.less files we have found.
compileAllLessScripts(LessFilesArray);
function LookInsideFolder(Folder) {
    // find all files and folders inside current folder
    var directoryListArray = fs.readdirSync(Folder);
    // loop through each file/folder
    directoryListArray.forEach((aFileOrFolder) => {
        // aFileOrFolder is just the name, does not contain its path, so lets add the path and file name together
        let pathLocation = path.resolve(Folder, aFileOrFolder);
        // pathInfo lets us work out if it is a file or a folder we are dealing with
        let pathInfo = fs.lstatSync(pathLocation);
        if (pathInfo.isFile()) {
            // check to see if the file is a *.less file. if it is, add it to the array
            if (isLessFile(aFileOrFolder))
                LessFilesArray.push(pathLocation);
        }
        else if (pathInfo.isDirectory()) {
            // check to see if it is a folder we should ignore
            if (!ShouldIgnoreFolder(aFileOrFolder)) {
                // look inside this folder for *.less files
                LookInsideFolder(path.resolve(Folder, aFileOrFolder));
            }
        }
    });
}
function ShouldIgnoreFolder(FolderName) {
    let folderNameAsLoswerCase = FolderName.toLowerCase();
    for (var i = 0; i < FoldersToIgnore.length; i++) {
        if (FoldersToIgnore[i] == folderNameAsLoswerCase)
            return true;
    }
    return false;
}
// checks to see if the file we have round is a *.less file
function isLessFile(fileName) {
    if (fileName.endsWith('.less'))
        return true;
    else
        return false;
}
function compileAllLessScripts(LessScriptsArray) {
    LessScriptsArray.forEach(aScript => {
        compileLessScript(aScript);
    });
}
function compileLessScript(script) {
    var lessFile = new LessFile(script);
    lessFile.ConvertFileToCSS();
}
