# multiple-less-to-css-converter
converts all less files within a project to css files.


A Node js script that can be run from command line to convert all less files to css files. The css files will be given the same name as the less files and put in the same directory the less files reside.

To run the script type the following at the base directory of your project

node less-compiler-script.js

You can also place the script inside a folder (may be you want to keep your scripts inside a folder for tidyness) and it will work (as long as you run the command from the base directory of your project.

Example

Assuming you have a folder called compiler-scripts in the root directory of your project and you put the script inside there you can run the following comamnd from the root of the project

node ./compiler-scripts/less-compiler-script.js
