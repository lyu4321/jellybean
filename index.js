import fs, { mkdirSync } from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

/**
 * Checks to see if an output directory exists and if it does, remove it, then create the directory
 * @param {string} directory => path to the directory
 */
const createDirectory = (directory) => {
    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
    }
    mkdirSync(directory);
}

/**
 * Creates a layout, replacing placeholders with user input
 * @param {string} layout => layout string
 * @param {string} stylesheet => replaces {stylesheet} placeholder in layout
 * @param {string} nav => replaces {nav} placeholder in layout
 * @param {string} title => replaces {title} placeholder in layout
 * @param {string} body => replaces {body} placeholder in layout
 * @return {string} => returns the layout as a string
 */
const getLayout = (layout, stylesheet, title, nav, body) => {
    return layout
        .replace(/{stylesheet}/g, stylesheet)
        .replace(/{title}/g, title)
        .replace(/{nav}/g, nav)
        .replace(/{body}/g, body)
}

/**
 * Creates the nav of a page based on the files in a directory
 * @param {array} files => array of file paths
 * @return {string} => returns a string of the html used to create the navigation
 */
const getNav = (files) => {
    if (!Array.isArray(files)) {
        return '';
    } else {
        let links = files.map(file => {
            let filename = path.parse(path.basename(file)).name;
            let name = filename[0].toUpperCase() + filename.slice(1).toLowerCase();
            return `<li><a href='./${filename}.html'>${name}</a></li>`;
        })
            .join(' ');
        return `<div><ul>${links}</ul></div>`;
    }
}

/**
 * Creates the title and body of a page from the contents of a .txt file
 * @param {string} file => the file text 
 * @return {string} => returns an object containing the string for the title and string for the body 
 */
const getHtml = (file) => {
    let html = {
        title: '',
        body: ''
    }
    let tempTitle = file.match(/^.+(\r?\n\r?\n\r?\n)/);
    if (tempTitle) {
        html.title = tempTitle[0].trim();
    }
    html.body = file
        .split(/\r?\n\r?\n/)
        .map(para => {
            if (para == html.title) {
                `<h1>${para.replace(/\r?\n/, ' ')}</h1>\n`
            } else {
                return `<p>${para.replace(/\r?\n/, ' ')}</p>\n`;
            }
        })
        .join('');
    return html;
}

/**
 * Reads a single file and outputs the contents to a .html file in the output directory
 * @param {string} file => path to file
 * @param {string} directory => path to output directory
 * @param {string} stylesheet => path/URL to stylesheet
 * @param {string} files => array of all .txt files in a directory
 */
const readFile = (file, directory, stylesheet, files) => {
    fs.readFile(file, 'utf8', (err, f) => {
        if (err) {
            console.log(err);
        }
        const nav = getNav(files);
        const html = getHtml(f);
        const filename = path.parse(path.basename(file)).name;
        let layout = fs.readFileSync('layout.html', 'utf8');
        let updatedLayout = getLayout(layout, stylesheet, html.title, nav, html.body);
        fs.writeFile(`${directory}/${filename}.html`, updatedLayout, 'utf8', (err) => {
            if (err) {
                console.log(err);
            }
        })
        if (stylesheet == 'style.css') {
            let style = fs.readFileSync(stylesheet, 'utf8');
            fs.writeFile(`${directory}/${stylesheet}`, style, 'utf8', (err) => {
                if (err) {
                    console.log(err);
                }
            })
        }
    })
}

/**
 * Checks the user input 
 * @param {string} input => path to a file or directory
 * @param {string} output => path to an output directory
 * @param {string} stylesheet => stylesheet url
 * @return {boolean} => returns true if the user input is valid (valid input and output directory) 
 */
const getUserInput = (input, output, stylesheet) => {
    let filesArray = [];

    // Setting the output directory
    if (output) {
        if (!fs.existsSync(output)) {
            return false;
        }
    } else {
        output = 'dist';
    }
    // Setting the stylesheet
    if (!stylesheet) {
        stylesheet = 'style.css';
    }
    // Setting the input
    if (!input || !fs.existsSync(input)) {
        return false;
    } else {
        if (fs.statSync(input).isFile() && path.extname(input) == '.txt') {
            createDirectory(output);
            readFile(input, output, stylesheet);
        } else if (fs.statSync(input).isDirectory()) {
            fs.readdir(input, (err, files) => {
                if (err) {
                    console.log(err);
                }
                createDirectory(output);
                filesArray = files.filter(f => path.extname(f) == '.txt');
                filesArray.forEach(file => {
                    if (fs.existsSync(`${input}/${file}`)) {
                        readFile(`${input}/${file}`, output, stylesheet, filesArray);
                    }
                })
            });
        } else {
            return false;
        }
    }
    return true;
}

/**
 * Gets the user input from the command line and checks the input, printing an error message if the input argument is invalid
 */
const main = () => {
    const argv = yargs(hideBin(process.argv))
        .help('h')
        .alias('h', 'help')
        .version(pkg.name + ' ' + pkg.version)
        .alias('v', 'version')
        .options('input', {
            alias: 'i',
            demandOption: true,
            describe: 'Path to a .txt file or folder with files',
            type: 'array'
        })
        .option('output', {
            alias: 'o',
            describe: 'Path to an output directory',
            type: 'string'
        })
        .option('stylesheet', {
            alias: 's',
            describe: 'Stylesheet URL',
            type: 'string'
        })
        .argv;
    let check = getUserInput(argv.input.join(' '), argv.output, argv.stylesheet);
    if (!check) {
        console.log('Invalid argument entered. Please see --help for options.');
    }
}

main();


