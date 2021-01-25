module.exports = function (style: string, useAdoptedStyleSheets: boolean) {
    const regexImports = new RegExp(/@import '[^']*';|@import "[^"]*";/, 'g');
    const imports: Array<string> = style.match(regexImports);
    const importsFormatted = imports ? imports.map((value, index) => value.replace('@import', `import style${index} from `)) : [];
    const styleWithoutImports = style.replace(regexImports, '');

    let resultString = '';
    importsFormatted.forEach(importFormatted => resultString = resultString.concat(importFormatted));
    resultString = resultString.concat(`let style;`);
    resultString = resultString.concat(`if(${useAdoptedStyleSheets} && (window.ShadowRoot && (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype)){`);
    resultString = resultString.concat(`style = new CSSStyleSheet();`);
    resultString = resultString.concat(`style.replaceSync('${minifyString(styleWithoutImports)}');`);
    resultString = resultString.concat(`}else{`);
    resultString = resultString.concat(`style = '${minifyString(styleWithoutImports)}';`);
    resultString = resultString.concat(`}`);

    if (importsFormatted.length > 0) {
        resultString = resultString.concat(`export default [style${importsFormatted.map((_, index) => `,...style${index}`).join('')}];`);
    } else {
        resultString = resultString.concat(`export default [style];`);
    }
    return resultString;
}

function minifyString(string) {
    return string.replace(/\s+/g, ' ').trim();
}