import fs from 'fs';
import path from 'path';

export function subtractPath(source, part) {
    source = source.split(path.sep);
    part = part.split(path.sep);

    return source.slice(part.length).join(path.sep);
}

export function mkpath(pth) {
    let parts = pth.split(path.sep),
        currentPath = '';

    parts.forEach((p) => {
        currentPath = path.join(currentPath, p);
        if(!fs.existsSync(currentPath))
            fs.mkdirSync(currentPath);
    });
}