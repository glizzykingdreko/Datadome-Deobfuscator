const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const transformFromAst = require('@babel/core').transformFromAstSync;
const t = require('@babel/types');
const vm = require('vm');

function initialTransformations(ast) {
    const sandbox = {};
    vm.createContext(sandbox);

    let firstFunctionCode;
    let shuffleFunctionCode;
    let firstFunctionName;

    traverse(ast, {
        FunctionDeclaration(path) {
            if (!firstFunctionCode) {
                const { code } = transformFromAst(t.file(t.program([path.node])));
                firstFunctionCode = code;
                firstFunctionName = path.node.id.name;
                path.remove();
                path.stop();  // stop traversing once the first function is found
            }
        }
    });

    vm.runInContext(firstFunctionCode, sandbox);

    let extractedValue;
    let extractedValueCode;
    let modifiedCode;

    traverse(ast, {
        CallExpression(path) {
            if (path.node.callee.type === 'FunctionExpression' &&
                path.node.arguments.length === 2 &&
                path.node.arguments[0].name === firstFunctionName) {

                const functionBody = path.node.callee.body.body;
                if (functionBody.length > 0 && t.isVariableDeclaration(functionBody[0])) {
                    const declarations = functionBody[0].declarations;
                    if (declarations.length > 0 && t.isIdentifier(declarations[0].init)) {
                        extractedValue = declarations[0].init.name;
                    }
                }

                shuffleFunctionCode = generate(path.node).code;
                modifiedCode = "(" + shuffleFunctionCode.replace('}(_', '})(_');
                path.remove();
            }
        }
    });

    traverse(ast, {
        FunctionDeclaration(path) {
            if (path.node.id.name === extractedValue) {
                const { code } = transformFromAst(t.file(t.program([path.node])));
                extractedValueCode = code;
                vm.runInContext(extractedValueCode, sandbox);
                path.remove();
            }
        }
    });

    vm.runInContext(modifiedCode, sandbox);

    traverse(ast, {
        CallExpression(path) {
            if (path.node.arguments.length === 1 && t.isNumericLiteral(path.node.arguments[0])) {
                try {
                    const result = sandbox[extractedValue](path.node.arguments[0].value);
                    console.log(`Replacing ${extractedValue}(${path.node.arguments[0].value}) with ${result}`)
                    if (typeof result === 'string') {
                        path.replaceWith(t.stringLiteral(result));
                    }
                } catch (e) {
                }
            }
        }
    });

    return ast;
}

module.exports = initialTransformations;