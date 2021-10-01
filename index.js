const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const pkg = require('./package.json');


/**
 * Checks to see if an output directory exists and if it does, remove it, then create the directory
 * @param {string} directory => path to the directory
 */
const createDirectory = (directory) => {
    if (fs.existsSync(directory)) {
        fs.rmdirSync(directory, { recursive: true });
    }
    fs.mkdirSync(directory);
}

/**
 * Reads the layout.html file contents
 * @return {string} => returns the file contents as a string
 */
const getLayout = () => {
    return fs.readFileSync('layout.html', 'utf8');
}

/**
 * Creates a layout, replacing placeholders with user input
 * @param {string} layout => layout string
 * @param {object} argv => command line args
 * @param {string} nav => replaces {nav} placeholder in layout
 * @param {string} title => replaces {title} placeholder in layout
 * @param {string} body => replaces {body} placeholder in layout
 * @return {string} => returns the layout as a string
 */
const getUpdatedLayout = (layout, argv, title, nav, body) => {
    return layout
        .replace(/{stylesheet}/g, argv.stylesheet)
        .replace(/{title}/g, title)
        .replace(/{nav}/g, nav)
        .replace(/{body}/g, body)
        .replace('en-CA', argv.lang || 'en-CA');
}

/**
 * Creates the nav of a page based on a file or files in a directory
 * @param {array} input => a single file path or array of file paths
 * @return {string} => returns a string of the html used to create the navigation
 */
const getNav = (input) => {
    let index = `<li><a href='./index.html'>Home</a></li>`;
    if (!Array.isArray(input)) {
        let filename = path.parse(path.basename(input)).name;
        return `<div><ul>${index}<li><a href='./${filename}.html'>${filename}</a></li></ul></div>`;
    } else {
        let links = input.map(file => {
            let filename = path.parse(path.basename(file)).name;
            return `<li><a href='./${filename}.html'>${filename}</a></li>`;
        })
            .join(' ');
        return `<div><ul>${index}${links}</ul></div>`;
    }
}

/**
 * Creates the title and body of a page from the contents of a .txt/.md file
 * @param {string} file => the file text 
 * @return {string} => returns an object containing the string for the title and string for the body 
 */
const getHtml = (file, isTxt) => {
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
        .map((para) => {
            if (para == html.title) {
                `<h1>${para.replace(/\r?\n/, " ")}</h1>\n`;
            } else {
                if (isTxt) {
                    return `<p>${para.replace(/\r?\n/, ' ')}</p>\n`;
                } else {
                    let string = para
                        .replace(/^\s*#{1} (.*$)/, "<h1>$1</h1>")
                        .replace(/^\s*#{2} (.*$)/, "<h2>$1</h2>")
                        .replace(/^\s*#{3} (.*$)/, "<h3>$1</h3>");

                    return string.startsWith("<h")
                        ? string + "\n"
                        : `<p>${string.replace(/\r?\n/, " ")}</p>\n`;
                }
            }
        })
        .join('');
    return html;
}

/**
 * Reads a single file and outputs the contents to a .html file in the output directory
 * @param {object} argv => command line args
 * @param {string} file => path to file
 * @param {string} files => array of all .txt or .md files in a directory
 */
const readFile = (argv, file, files) => {
    fs.readFile(file, 'utf8', (err, f) => {
        if (err) {
            console.error(`The file ${file} could not be read`);
            process.exit(-1);
        }
        const nav = getNav(files || file);
        const html = getHtml(f, path.extname(file) == '.txt');
        const filename = path.parse(path.basename(file)).name;
        let layout = getLayout();
        let updatedLayout = getUpdatedLayout(layout, argv, html.title, nav, html.body);
        fs.writeFile(`${argv.output}/${filename}.html`, updatedLayout, 'utf8', (err) => {
            if (err) {
                console.error(`The file ${argv.output}/${filename}.html could not be created`);
                process.exit(-1);
            }
        })
        if (argv.stylesheet == 'style.css') {
            let style = fs.readFileSync(argv.stylesheet, 'utf8');
            fs.writeFile(`${argv.output}/${argv.stylesheet}`, style, 'utf8', (err) => {
                if (err) {
                    console.error(`The file ${argv.output}/${argv.stylesheet} could not be created`);
                    process.exit(-1);
                }
            })
        }
    })
}

/**
 * Creates an index.html page for the generated site
 * @param {object} argv => command line args
 * @param {string, array} input => a single file or array of all .txt or .md files in a directory
 */
const writeIndexPage = (argv, input) => {
    let layout = getLayout();
    let nav = getNav(input);
    let updatedLayout = getUpdatedLayout(layout, argv, 'Home', nav, '');
    fs.writeFile(`${argv.output}/index.html`, updatedLayout, 'utf8', (err) => {
        if (err) {
            console.error(`The file ${argv.output}/index.html could not be created`);
            process.exit(-1);
        }
    })
}

/**
 * Checks the user input 
 * @param {object} argv => command line args
 * @return {boolean} => returns true if the user input is valid (valid input and output directory) 
 */
const getUserInput = (argv) => {
    let input = argv.input.join(' ');
    let filesArray = [];

    // Setting the output directory
    if (argv.output) {
        if (!fs.existsSync(argv.output)) {
            return false;
        }
    } else {
        argv.output = 'dist';
    }
    // Setting the stylesheet
    if (!argv.stylesheet) {
        argv.stylesheet = 'style.css';
    }
    // Setting the input
    if (!input || !fs.existsSync(input)) {
        return false;
    } else {
        if (fs.statSync(input).isFile() && (path.extname(input) == '.txt' || path.extname(input) == '.md')) {
            createDirectory(argv.output);
            writeIndexPage(argv, input);
            readFile(argv, input);
        } else if (fs.statSync(input).isDirectory()) {
            fs.readdir(input, (err, files) => {
                if (err) {
                    console.error(`The directory ${input} could not be read`);
                    process.exit(-1);
                }
                filesArray = files.filter(f => path.extname(f) == '.txt' || path.extname(f) == '.md');
                createDirectory(argv.output);
                writeIndexPage(argv, filesArray);
                filesArray.forEach(file => {
                    if (fs.existsSync(`${input}/${file}`)) {
                        readFile(argv, `${input}/${file}`, fileArray);
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
            describe: 'Path to a file or folder with files',
            type: 'array'
        })
        .option('lang', {
            alias: 'l',
            describe: 'Language used in generated HTML files',
            type: 'string'
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
    let check = getUserInput(argv);
    if (!check) {
        console.error('Invalid argument entered. Please see --help for options.');
    }
}

main();