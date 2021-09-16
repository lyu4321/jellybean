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

/**
 * Checks to see if a directory exists and if it does, remove it, then create the directory
 * @param {string} directory => path to the directory
 */
const createDirectory = (directory) => {
    currentDirectory = directory;
    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
    }
    mkdirSync(directory);
}

/**
 * Parses a path to get the filename
 * @param {string} path => the path to be parsed
 * @return {string} => returns the filename
 */
const getFilename = (string) => {
    return path.parse(path.basename(string)).name;
}

/**
 * Creates a layout, replacing placeholders with user input
 * @param {string} layout => layout string
 * @param {string} nav => replaces placeholder in layout
 * @param {string} title => replaces placeholder in layout
 * @param {string} body => replaces placeholder in layout
 * @return {string} => returns the layout
 */
const getLayout = (layout, nav, title, body) => {
    return layout
        .replace(/{stylesheet}/g, currentStylesheet)
        .replace(/{nav}/g, nav)
        .replace(/{title}/g, title)
        .replace(/{body}/g, body)
}

/**
 * Creates a nav, replacing placeholder with user input
 * @param {array} files => array of file paths
 * @return {string} => returns a string containing the html for navigation links
 */
const getNav = (files) => {
    console.log(files);
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

/**
 * Creates the body of the page, replacing placeholder with user input
 * @param {string} file => the file text to be used in the body
 * @return {string} => returns a string containing the html for the body 
 */
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

/**
 * Reads a single file and outputs the contents to a .html file in the output directory
 * @param {string} file => the .txt file to be read
 */
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

/**
 * Reads a directory to find all .txt files and performs readFile() on each .txt file
 * @param {string} directory => path to the directory
 */
const readFiles = (directory) => {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.log(err);
        }
        files.forEach(file => {
            if (fs.existsSync(`${directory}/${file}`) && path.extname(file) == '.txt') {
                filesArray.push(file);
                readFile(`${directory}/${file}`);
            }
        })
    });
}

/**
 * Checks the user input and if file/directory are valid, reads the file(s)
 * @param {string} input => path to a file/directory
 * @return {boolean} => returns true if the input is valid (file/directory exist, file is of type .txt)
 */
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

/**
 * Sets the output directory
 * @param {string} output => sets global directory to user input or 'dist' if no user input
 * @return {boolean} => returns true if the custom output directory is valid
 */
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

/**
 * Sets the stylesheet 
 * @param {string} stylesheet => set global stylesheet to user input or 'style.css' if no user input
 */
const getCustomStylesheet = (stylesheet) => {
    if (stylesheet) {
        currentStylesheet = stylesheet;
    } else {
        currentStylesheet = 'style.css'
    }
}

/**
 * Checks the user input 
 * @param {string} input => path to a file or directory
 * @param {string} output => path to an output directory
 * @param {string} stylesheet => stylesheet url
 * @return {boolean} => returns true if the user input is valid (valid input and output directory) 
 */
const getUserInput = (input, output, stylesheet) => {
    if (!input || !checkInput(input)) {
        return false;
    }
    if (!getCustomOutput(output)) {
        return false;
    }
    getCustomStylesheet(stylesheet);
    return true;
}

/**
 * Gets the user input from the command line and checks the input, printing an error message if the input is invalid
 */
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


