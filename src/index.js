#!/usr/bin/env node
import fs, { mkdirSync } from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

let currentDirectory = 'dist';
let currentTemplate = 'layout.html'
let currentStylesheet = 'style.css';
let filesArray = [];
let title = '';

const createDirectory = (directory) => {
    currentDirectory = directory;
    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
    }
    mkdirSync(directory);
}

const getFilename = (string) => {
    return path.parse(path.basename(string)).name;
}

const getLayout = (layout, nav, title, body) => {
    return layout
        .replace(/{stylesheet}/g, currentStylesheet)
        .replace(/{nav}/g, nav)
        .replace(/{title}/g, title)
        .replace(/{body}/g, body)
}

const getNav = (files) => {
    if (!Array.isArray(files)) {
        return '';
    } else {
        let links = files.map(file => {
            let filename = getFilename(file);
            let name = filename[0].toUpperCase() + filename.slice(1).toLowerCase();
            return `<li><a href='./${filename}.html'>${name}</a></li>`;
        })
            .join(' ');
        return `<div><ul>${links}</ul></div>`;
    }
}

const getHtml = (file) => {
    let tempTitle = file.match(/^.+(\r?\n\r?\n\r?\n)/);
    if (tempTitle) {
        title = tempTitle[0].trim();
    }
    return file
        .split(/\r?\n\r?\n/)
        .map(para => {
            if (para == title) {
                return;
            } else {
                return `<p>${para.replace(/\r?\n/, ' ')}</p>\n`;
            }
        })
        .join('');
}

const readFile = (file) => {
    fs.readFile(file, 'utf8', (err, f) => {
        if (err) {
            console.log(err);
        }
        const html = getHtml(f);
        const nav = getNav(filesArray);
        const basename = (getFilename(file));
        const src = path.resolve('src');
        let temp = fs.readFileSync(path.join(src, currentTemplate), 'utf8');
        let updatedTemplate = getLayout(temp, nav, title, html);
        fs.writeFile(`${currentDirectory}/${basename}.html`, updatedTemplate, 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        })
        if (currentStylesheet == 'style.css') {
            let style = fs.readFileSync(path.join(src, currentStylesheet), 'utf8');
            fs.writeFile(`${currentDirectory}/${currentStylesheet}`, style, 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
}

const readFiles = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log(err);
        }
        filesArray = files;
        files.forEach(file => {
            if (fs.existsSync(`${directory}/${file}`) && file.lastIndexOf('.txt') != -1) {
                readFile(`${directory}/${file}`);
            }
        })
    });
}

const checkInput = (input) => {
    if (fs.existsSync(input)) {
        if (fs.statSync(input).isFile()) {
            if (path.extname(input) == '.txt') {
                readFile(input);
                return true;
            }
        } else if (fs.statSync(input).isDirectory()) {
            readFiles(input);
            return true;
        }
    }
    return false;
}

const getCustomOutput = (output) => {
    if (output) {
        if (fs.existsSync(output)) {
            createDirectory(output);
            return true;
        }
        return false;
    } else {
        createDirectory('dist');
        return true;
    }
}

const getCustomStylesheet = (stylesheet) => {
    if (stylesheet) {
        currentStylesheet = stylesheet;
    } else {
        currentStylesheet = 'style.css'
    }
    return true;
}

const getUserInput = (input, output, stylesheet) => {
    if (!input || !checkInput(input)) {
        return false;
    }
    if (getCustomOutput(output)) {
    } else {
        return false;
    }
    if (getCustomStylesheet(stylesheet)) {
    } else {
        return false;
    }
    return true;
}

const main = () => {
    const argv = yargs(hideBin(process.argv))
        .help('h')
        .alias('h', 'help')
        .version()
        .alias('v', 'version')
        .options('input', {
            alias: 'i',
            demandOption: true,
            describe: 'A .txt file or folder with .txt files to be generated into a static site',
            type: 'string'
        })
        .option('output', {
            alias: 'o',
            describe: 'A custom output directory for generated files to be stored',
            type: 'string'
        })
        .option('stylesheet', {
            alias: 's',
            describe: 'A custom stylesheet URL',
            type: 'string'
        })
        .argv
    let check = getUserInput(argv.input, argv.output, argv.stylesheet);
    if (!check) {
        console.log('Invalid option entered. Please see --help for options.');
    }
}

main();


