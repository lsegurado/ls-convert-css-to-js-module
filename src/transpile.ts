import fs from 'fs';
import path from 'path';
import convertCssStringIntoJsModule from './convertCssStringIntoJsModule';

export default function transpile(srcDir: string, outDir: string, watch: boolean, adoptedStyleSheets: boolean) {

    fs.mkdirSync(outDir, { recursive: true });

    function getFilesByExtension(base: string, ext: string, files?: string[], result?: string[]) {
        files = files || fs.readdirSync(base)
        result = result || []

        files.forEach(
            function (file) {
                var newbase = path.join(base, file)
                if (fs.statSync(newbase).isDirectory()) {
                    result = getFilesByExtension(newbase, ext, fs.readdirSync(newbase), result)
                }
                else {
                    if (file.substr(-1 * (ext.length + 1)) == '.' + ext) {
                        result.push(newbase)
                    }
                }
            }
        )
        return result
    }

    const fileList = getFilesByExtension(srcDir, 'css');
    fileList.forEach(file => {
        transpileCssFile(file);
    })

    if (watch) {
        fs.watch(srcDir, { recursive: true }, (_eventType, filename) => {
            if (filename.endsWith('.css')) {
                transpileCssFile(srcDir + '\\' + filename);
            }
        });
    }

    function transpileCssFile(filename: string) {
        const style = fs.readFileSync(filename, "utf8");
        const outFilePath = filename.replace(srcDir, outDir);
        const outFilePathSplitted = outFilePath.split('\\');
        outFilePathSplitted.pop();
        fs.mkdirSync(outFilePathSplitted.join('\\'), { recursive: true });
        fs.writeFileSync(`${outFilePath}.js`, convertCssStringIntoJsModule(style, adoptedStyleSheets));
    }
}