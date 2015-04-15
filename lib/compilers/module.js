import path from 'path';
import fs from 'fs';
import { transform } from 'babel';
import walk from '../utils/walk';
import ngify from './ngify';
import { subtractPath, mkpath } from '../utils/path'

function submoduleType(file) {
    let fullpath = path.join(file.path, file.name);
    return fullpath.indexOf('controller') > -1 ? 'controller'
        : fullpath.indexOf('service') > -1 ? 'service'
        : fullpath.indexOf('directive') > -1 ? 'directive'
        : fullpath.indexOf('factory') > -1 ? 'factory'
        : '';
}

function loadDeps(src) {
    let filepath = path.join(process.cwd(), src, 'dependencies.js');
    return fs.existsSync( filepath ) ? require(filepath) : [];
}

/*let options = {
    modules: './lib/ng-module-formatter'
};*/
export default function compile(src, dest, moduleName) {
    src = path.join(src, moduleName);
    dest = path.join(dest, moduleName);

    let files = walk(src, /\*\.js/);
    let ignoredFiles = [
        'dependencies'
    ];

    // === map/load content
    files = files.map((filepath) => {
        let file = { name: path.basename(filepath, '.js'), path: subtractPath(filepath, src), content: fs.readFileSync(filepath, 'utf8') };
        file.path = file.path.substring(0, file.path.lastIndexOf(path.sep)); // remove filename from path
        file.type = submoduleType(file);
        return file;
    });

    files = files.filter(file => ignoredFiles.indexOf(file.name) == -1);

    // === ng-ify
    files.forEach((file) => {
        file.content = ngify.compile({ name: moduleName }, file, file.content);
    });

    // === ES6 Transpile
    files.forEach((file) => {
        file.content = transform(file.content, {}).code
    });

    // === create the path to new files
    files.forEach((file) => {
        mkpath( path.join(dest, file.path) );
    });

    // === write file content
    files.forEach(file => {
        fs.writeFileSync( path.join(dest, file.path, file.name+'.js'), file.content, 'utf8')
    });

    // === make module file
    fs.writeFileSync( path.join(dest, 'module.js'), ngify.app({ name: moduleName, dependencies: loadDeps(src) }), 'utf8' );
}