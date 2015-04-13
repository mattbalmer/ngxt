import path from 'path';
import fs from 'fs';
import { transform } from 'babel';
import walk from '../utils/walk';
import ngify from './ngify';
import compileModule from './module';

//function findModules(src, paths) {
//    let modules = paths.map(filename => path.subtract(filename, src));
//    modules = modules.map(filepath => filepath.split(path.sep)[0]);
//    return modules.filter((name, i) => modules.indexOf(name) == i); //uniques
//}

export default function compile(src, dest) {
    let modules = fs.readdirSync(src);

    modules.forEach(mod => compileModule(src, dest, mod));
}