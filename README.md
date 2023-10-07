# Datadome Deobfuscator

A project that aims to decode, deobfuscate, and simplify JavaScript files that are obfuscated by the Datadome protection system. (designed for the tags.js file, not tested with others)

## Features
- Decode hexadecimal encoded strings in the JavaScript file.
- Transform initial function calls and variables to a more readable format.
- Remove dead code (unused functions and variables).
- Optionally rename obfuscated variable and function names to more readable names.

## Prerequisites
- Node.js
- Babel libraries: `@babel/parser`, `@babel/traverse`, `@babel/generator`, `@babel/core`, `@babel/types`

## Usage
To run the deobfuscator:
```bash
node main.js [inputFilePath] [outputFilePath] [--rename]
```
- `inputFilePath`: (Optional) Path to the input JavaScript file. Default is `script.js`.
- `outputFilePath`: (Optional) Path where the deobfuscated code should be written. Default is `filename.clean.js`.
- `--rename`: (Optional) Flag to rename obfuscated variable and function names.

## Structure
- `main.js`: Main driver script that coordinates the deobfuscation process.
- `transformers/`: Directory containing various transformation scripts.
    - `decodeHex.js`: Handles decoding of hexadecimal encoded strings.
    - `renameVariables.js`: Renames obfuscated variable and function names.
    - `removeDeadCode.js`: Removes unused functions and variables from the code.
    - `initialTransformations.js`: Handles the initial transformations, like function extraction and execution.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT [License](LICENSE). See the LICENSE file for more details.

## My links
- [Website](https://glizzykingdreko.github.io)
- [GitHub](https://github.com/glizzykingdreko)
- [Twitter](https://mobile.twitter.com/glizzykingdreko)
- [Medium](https://medium.com/@glizzykingdreko)
- [Email](mailto:glizzykingdreko@protonmail.com)