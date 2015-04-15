var fs = require('fs'),
    path = require('path');

export default function walk(dir, regex) {
    var paths = fs.readdirSync(dir)
        .map(pathString => path.join(dir, pathString) );

    var dirs = paths
        .filter(pathString => fs.lstatSync(pathString).isDirectory() )
        .filter(pathString => regex ? regex.test(pathString) : true )
        .map(pathString => walk(pathString) )
        .reduce((array, files) => array.concat(files), []);

    var files = paths.filter(pathString => !fs.lstatSync(pathString).isDirectory() );

    return files.concat(dirs);
};