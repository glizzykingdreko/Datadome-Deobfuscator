const fs = require('fs');

function decodeHex(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const pattern = /'(\\x[0-9a-fA-F]+)+'/g;
    let matches = content.match(pattern) || [];

    let decodedStrings = matches.map(match => {
        let hexValues = match.slice(1, -1).replace(/\\x/g, '').match(/.{1,2}/g);
        return hexValues.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');
    });

    for (let i = 0; i < matches.length; i++) {
        content = content.replace(matches[i], "`" + decodedStrings[i] + "`");
    }

    return content;
}

module.exports = decodeHex;