import { firstIndex, lastIndex } from '../utils/arrays';

function findImports(content) {
    return content
        .match(/import {(.*?)} from '(.*?)';/g)
        .map(req => req.match(/import {(.*?)} from '(.*?)';/).slice(1))
        .map(dep => ({ name: dep[0], source: dep[1] }));
}

function findExports(content) {
    let index = content.indexOf('export default');
    return index == -1 ? '' :content.substring(index + 'export default'.length);
}

function findContent(content) {
    let lines = content.split('\n');

    let start = lastIndex(lines, line => line.trim().indexOf('import') == 0);
    let end = firstIndex(lines, line => line.trim().indexOf('export default') > -1);

    lines = end > -1 ? lines.slice(start + 1, end) : lines.slice(start + 1);

    return lines.join('\n');
}

export default function ngify(moduleParams, fileParams, rawContent) {
    let imports = findImports(rawContent).map(dep => dep.name).join(', ');
    let exports = findExports(rawContent);
    var compiledContent = findContent(rawContent);

    return `angular.module('${moduleParams.name}').${fileParams.type}('${fileParams.name}', function(${imports}) {
    ${compiledContent}
    ${exports ? 'return ' + exports : ''}
})`;
}

export function ngifyModule(moduleParams) {
    let dependencies = (moduleParams.dependencies || []).map(dep => `'${dep}'`).join(', ');
    return `angular.module('${moduleParams.name}', [${dependencies}]);`;
}