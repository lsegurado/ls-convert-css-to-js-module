module.exports = function(style: string){
    const regexImports = new RegExp(/@import '[^']*';|@import "[^"]*";/, 'g');
    const imports: Array<string> = style.match(regexImports);
    const importsFormatted = imports ? imports.map((value, index) => value.replace('@import', `import style${index} from `)) : [];
    const styleWithoutImports = style.replace(regexImports, '');

    let resultString = '';
    if (importsFormatted.length > 0) {
        importsFormatted.forEach(importFormatted => resultString = resultString.concat(importFormatted));
        resultString = resultString.concat(`let style = '${minifyString(styleWithoutImports)}';`);
        importsFormatted.forEach((_value, index) => resultString = resultString.concat(`style = style.concat(style${index});`));
        resultString = resultString.concat(`export default style;`);
    } else {
        resultString = resultString.concat(`export default '${minifyString(styleWithoutImports)}';`);
    }
    return resultString;
}

function minifyString(string) {
    return string.replace(/\s+/g, ' ').trim();
}