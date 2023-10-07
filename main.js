const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const generate = require('@babel/generator').default;

const decodeHex = require('./transformers/decodeHex');
const removeDeadCode = require('./transformers/removeDeadCode');
const renameVariables = require('./transformers/renameVariables');
const initialTransformations = require('./transformers/initialTransformations');

function processCode(inputFilePath = 'script.js', outputFilePath, rename = false) {
    const code = decodeHex(inputFilePath);

    let ast = parser.parse(code, {
        sourceType: "script",
        plugins: ["jsx"]
    });

    ast = initialTransformations(ast);

    const cleanedAst = removeDeadCode(ast);
    if (rename) {
        renameVariables(cleanedAst);
    }

    const output = generate(cleanedAst).code;
    const outputFile = outputFilePath || path.basename(inputFilePath, '.js') + '.clean.js';
    fs.writeFileSync(outputFile, output, 'utf8');
    console.log(`Output written to ${outputFile}`);
}

// Command-line handling
const args = process.argv.slice(2);
let inputFile, outputFile, shouldRename = false;

args.forEach((arg, index) => {
    if (arg === '--rename') {
        shouldRename = true;
    } else if (!inputFile) {
        inputFile = arg;
    } else if (!outputFile) {
        outputFile = arg;
    }
});

processCode(inputFile, outputFile, shouldRename);