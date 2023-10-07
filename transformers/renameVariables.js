const traverse = require('@babel/traverse').default;

function renameVariables(ast) {
    let renameMap = {};
    let counter = 1;

    traverse(ast, {
        Identifier(path) {
            if (!renameMap[path.node.name]) {
                renameMap[path.node.name] = `var_${counter++}`;
            }
            path.node.name = renameMap[path.node.name];
        }
    });

    return ast;
}

module.exports = renameVariables;