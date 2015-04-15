import { firstIndex, lastIndex } from '../utils/arrays';

function findImports(content) {
    return (content
        .match(/import {(.*?)} from '(.*?)';/g) || [])
        .map(req => (req.match(/import {(.*?)} from '(.*?)';/) || []).slice(1))
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

// === Exports ===
let compilers = {
    directive(moduleParams, fileParams, rawContent) {
        let imports = findImports(rawContent).map(dep => dep.name).join(', ');
        let exports = findExports(rawContent);

        return `angular.module('${moduleParams.name}').directive('${fileParams.name}', function(${imports}) {
    return ${exports}
})`;
    },

    service(moduleParams, fileParams, rawContent) {
        let imports = findImports(rawContent).map(dep => dep.name).join(', ');
        let exports = findExports(rawContent);
        var compiledContent = findContent(rawContent);

        return `angular.module('${moduleParams.name}').service('${fileParams.name}', function(${imports}) {
    ${compiledContent}
    return ${exports}
})`;
    },

    controller(moduleParams, fileParams, rawContent) {
        let imports = findImports(rawContent).map(dep => dep.name).join(', ');
        var compiledContent = findContent(rawContent);

        return `angular.module('${moduleParams.name}').controller('${fileParams.name}', function(${imports}) {
    ${compiledContent}
})`;
    },

    app(moduleParams) {
        let dependencies = (moduleParams.dependencies || []).map(dep => `'${dep}'`).join(', ');
        return `angular.module('${moduleParams.name}', [${dependencies}]);`;
    },

    compile(moduleParams, file, content) {
        if(!compilers[file.type]) {
            console.warn(`No compiler found for file ${file.name} with type ${file.type}`);
        } else {
            return compilers[file.type].apply(compilers, arguments);
        }
    }
};

export default compilers;