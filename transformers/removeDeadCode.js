const traverse = require('@babel/traverse').default;

function removeDeadCode(ast) {
    let declaredVariables = new Set();
    let declaredFunctions = new Set();
    let referencedIdentifiers = new Set();

    traverse(ast, {
        VariableDeclarator(path) {
            if (path.node.id && path.node.id.name) {
                declaredVariables.add(path.node.id.name);
            }
        },
        FunctionDeclaration(path) {
            if (path.node.id && path.node.id.name) {
                declaredFunctions.add(path.node.id.name);
            }
        },
        Identifier(path) {
            if (!path.parentPath.isFunctionDeclaration() && !path.parentPath.isVariableDeclarator()) {
                referencedIdentifiers.add(path.node.name);
            }
        }
    });

    let unusedVariables = [...declaredVariables].filter(varName => !referencedIdentifiers.has(varName));
    let unusedFunctions = [...declaredFunctions].filter(funcName => !referencedIdentifiers.has(funcName));

    traverse(ast, {
        VariableDeclarator(path) {
            if (unusedVariables.includes(path.node.id.name)) {
                path.remove();
            }
        },
        FunctionDeclaration(path) {
            if (unusedFunctions.includes(path.node.id.name)) {
                path.remove();
            }
        }
    });

    return ast;
}

module.exports = removeDeadCode;