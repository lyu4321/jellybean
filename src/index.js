#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const pkg = require('../package.json');
const checkUserInput = require('./process-input');

/**
 * Gets the user input from the command line and checks the input, printing an error message if the input argument is invalid
 */
const main = () => {
    const argv = yargs(hideBin(process.argv))
        .help('h')
        .alias('h', 'help')
        .version(pkg.name + ' ' + pkg.version)
        .alias('v', 'version')
        .option('config', {
            alias: 'c',
            describe: 'Path to a JSON config file',
            type: 'string',
        })
        .options('input', {
            alias: 'i',
            describe: 'Path to a file or folder with files',
            type: 'array',
        })
        .option('lang', {
            alias: 'l',
            describe: 'Language used in generated HTML files',
            type: 'string',
        })
        .option('output', {
            alias: 'o',
            describe: 'Path to an output directory',
            type: 'string',
        })
        .option('stylesheet', {
            alias: 's',
            describe: 'Stylesheet URL',
            type: 'string',
        }).argv;
    if (!checkUserInput(argv)) {
        console.error('Please see --help for options.');
        process.exit(1);
    }
};

main();
