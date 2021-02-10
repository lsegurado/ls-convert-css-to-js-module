export default function convertCssStringIntoJsModule(style: string, useAdoptedStyleSheets: boolean) {
    const regexImports = new RegExp(/@import '[^']*';|@import "[^"]*";/, 'g');
    const imports: Array<string> = style.match(regexImports);
    const importsFormatted = imports ? imports.map((value, index) => value.replace('@import', `import style${index} from `)) : [];
    const styleWithoutImports = style.replace(regexImports, '');

    let resultString = '';
    importsFormatted.forEach(importFormatted => resultString = resultString.concat(importFormatted));
    resultString = resultString.concat(`let style;`);
    resultString = resultString.concat(`const stringStyle = '${normalize(styleWithoutImports)}';`);
    if (useAdoptedStyleSheets) {
        resultString = resultString.concat(`if(window.ShadowRoot && (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) && 'adoptedStyleSheets' in Document.prototype && 'replace' in CSSStyleSheet.prototype){`);
        resultString = resultString.concat(`style = new CSSStyleSheet();`);
        resultString = resultString.concat(`style.replaceSync(stringStyle);`);
        resultString = resultString.concat(`}else{`);
    }
    resultString = resultString.concat(`style = stringStyle;`);
    if (useAdoptedStyleSheets) {
        resultString = resultString.concat(`}`);
    }

    if (importsFormatted.length > 0) {
        resultString = resultString.concat(`export default [style${importsFormatted.map((_, index) => `,...style${index}`).join('')}];`);
    } else {
        resultString = resultString.concat(`export default [style];`);
    }
    return resultString;
}

function normalize(string) {
    return minifyString(string).replace(/\'/g, "\"");
}

function minifyString(string) {
    return string.replace(/\s+/g, ' ').trim();
}