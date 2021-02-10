import * as yargs from 'yargs';
import transpile from './transpile';

export function cli() {
    if (process.argv.find(x => x.includes('convertCssIntoJsModule'))) {
        const args = yargs
            .option('srcDir', {
                type: 'string',
                default: 'src'
            })
            .option('outDir', {
                type: 'string',
                default: 'dist'
            })
            .option('watch', {
                type: 'boolean',
                default: false,
                alias: 'w'
            })
            .option('adoptedStyleSheets', {
                type: 'boolean',
                default: false
            })
            .help()
            .alias('help', 'h')
            .argv;

        const srcDir = args.srcDir;
        const outDir = args.outDir;
        const watch = args.watch;
        const adoptedStyleSheets = args.adoptedStyleSheets;
        transpile(srcDir, outDir, watch, adoptedStyleSheets);
    }
}