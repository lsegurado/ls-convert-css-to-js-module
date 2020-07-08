import * as fs from 'fs';
import * as path from 'path';

const args: { srcDir: string, outDir: string } = getArgs();
const srcDir = args.srcDir || 'src';
const outDir = args.outDir || 'dist';

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
    const style = fs.readFileSync(file, "utf8");
    fs.writeFileSync(`${file.replace(srcDir, outDir)}.js`, encloseAsAVariable(minifyString(style)));
})

function encloseAsAVariable(text: string) {
    return `export default \`${text}\``;
}

function minifyString(string) {
    return string.replace(/\s+/g, ' ').trim();
}

function getArgs(): any {
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach(arg => {
            // long arg
            if (arg.slice(0, 2) === '--') {
                const longArg = arg.split('=');
                const longArgFlag = longArg[0].slice(2, longArg[0].length);
                const longArgValue = longArg.length > 1 ? longArg[1] : true;
                args[longArgFlag] = longArgValue;
            }
            // flags
            else if (arg[0] === '-') {
                const flags = arg.slice(1, arg.length).split('');
                flags.forEach(flag => {
                    args[flag] = true;
                });
            }
        });
    return args;
}