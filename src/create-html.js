const fs = require('fs');
const path = require('path');
const markdownit = require('markdown-it');

/**
 * Create the output directory and all files in the directory
 * @param {object} argv => command line args
 * @param {string} filesArray => array of all .txt and .md files in a directory
 */
const setupOutput = (argv, filesArray) => {
    // Create output directory
    createDirectory(argv.output);

    // Create index.html in output directory
    createIndexPage(argv, filesArray);

    // Read and write file(s) to output directory
    let input = argv.input;
    if (filesArray) {
        if (filesArray.length > 0) {
            filesArray.forEach((file) => {
                if (fs.existsSync(`${input}/${file}`)) {
                    fs.readFile(
                        `${input}/${file}`,
                        'utf8',
                        (err, fileContent) => {
                            if (err) {
                                console.error(
                                    `The file ${input}/${file} could not be read`
                                );
                                process.exit(1);
                            }
                            let newArgv = {
                                ...argv,
                                input: `${argv.input}/${file}`,
                            };
                            createHtmlFile(newArgv, fileContent, filesArray);
                        }
                    );
                }
            });
        } else {
            console.error(
                `The directory ${input} does not contain any .txt or .md files`
            );
            process.exit(1);
        }
    } else {
        fs.readFile(input, 'utf8', (err, fileContent) => {
            if (err) {
                console.error(`The file ${input} could not be read`);
                process.exit(1);
            }
            createHtmlFile(argv, fileContent);
        });
    }

    // Create style.css in output directory (if no custom stylesheet)
    if (argv.stylesheet == 'style.css') {
        let style = fs.readFileSync('src/' + argv.stylesheet, 'utf8');
        fs.writeFile(
            `${argv.output}/${argv.stylesheet}`,
            style,
            'utf8',
            (err) => {
                if (err) {
                    console.error(
                        `The file ${argv.output}/${argv.stylesheet} could not be created`
                    );
                    process.exit(1);
                }
            }
        );
    }
};

/**
 * Check if an output directory exists and if it does, remove it, then create the directory
 * @param {string} directory => path to the directory
 */
const createDirectory = (directory) => {
    if (fs.existsSync(directory)) {
        fs.rmSync(directory, { recursive: true });
    }
    fs.mkdirSync(directory);
};

/**
 * Read and return the layout.html file contents
 * @return {string} => return the file contents as a string
 */
const getHtmlLayout = () => {
    return fs.readFileSync('src/layout.html', 'utf8');
};

/**
 * Update and return the layout, replacing placeholders with user input
 * @param {object} html => object containing strings for layout stylesheet, title, nav, body, and lang
 * @return {string} => return the updated layout as a string
 */
const getUpdatedHtmlLayout = (html) => {
    let layout = html.layout;
    return layout
        .replace(/{stylesheet}/g, html.stylesheet)
        .replace(/{title}/g, html.title)
        .replace(/{nav}/g, html.nav)
        .replace(/{body}/g, html.body)
        .replace('en-CA', html.lang || 'en-CA');
};

/**
 * Create and return the nav of a page
 * @param {array} input => a single file path or array of file paths
 * @return {string} => return the nav as a string
 */
const getHtmlNav = (input) => {
    let index = `<li><a href='./index.html'>Home</a></li>`;
    if (input) {
        if (!Array.isArray(input)) {
            let filename = path.parse(path.basename(input)).name;
            return `<div><ul>${index}<li><a href='./${filename}.html'>${filename}</a></li></ul></div>`;
        } else {
            let links = input
                .map((file) => {
                    let filename = path.parse(path.basename(file)).name;
                    return `<li><a href='./${filename}.html'>${filename}</a></li>`;
                })
                .join('');
            return `<div><ul>${index}${links}</ul></div>`;
        }
    }
    return `<div><ul>${index}</ul></div>`;
};

/**
 * Create and return the title and body of a page
 * @param {string} file => file text
 * @return {string} => return an object containing strings for the title and body
 */
const getHtmlTitleBody = (file, isTxt) => {
    let html = {
        title: '',
        body: '',
    };

    let tempTitle = file.match(/^.+(\r?\n\r?\n\r?\n)/);
    if (tempTitle) {
        html.title = tempTitle[0].trim();
    }

    if (isTxt) {
        html.body = file
            .split(/\r?\n\r?\n/)
            .map((para) => {
                if (para == html.title) {
                    return `<h1>${para.replace(/\r?\n/, ' ')}</h1>\n`;
                } else {
                    return `<p>${para.replace(/\r?\n/, ' ')}</p>\n`;
                }
            })
            .join('');
    } else {
        let md = new markdownit();
        html.body = md.render(file.substring(html.title.length).trim());
    }

    return html;
};

/**
 * Given file contents, create an .html file in the output directory
 * @param {object} argv => command line args
 * @param {string} fileContent => contents of file
 * @param {string} filesArray => array of all .txt and .md files in a directory
 */
const createHtmlFile = (argv, fileContent, filesArray) => {
    let file = argv.input;

    // Get updated layout
    let layout = getHtmlLayout();
    let nav = getHtmlNav(filesArray || file);
    let html = getHtmlTitleBody(fileContent, path.extname(file) == '.txt');
    html = {
        ...html,
        layout: layout,
        nav: nav,
        stylesheet: argv.stylesheet,
        lang: argv.lang,
    };
    let updatedLayout = getUpdatedHtmlLayout(html);

    // Write contents to .html file in output directory
    let filename = path.parse(path.basename(file)).name;
    fs.writeFile(
        `${argv.output}/${filename}.html`,
        updatedLayout,
        'utf8',
        (err) => {
            if (err) {
                console.error(
                    `The file ${argv.output}/${filename}.html could not be created`
                );
                process.exit(1);
            } else {
                console.log(
                    `The file ${argv.output}/${filename}.html has been created`
                );
            }
        }
    );
};

/**
 * Create an index.html page for the generated site
 * @param {object} argv => command line args
 */
const createIndexPage = (argv, filesArray) => {
    // Get updated layout
    let layout = getHtmlLayout();
    let nav = getHtmlNav(filesArray || argv.input);
    let html = {
        title: 'Home',
        body: '',
        layout: layout,
        nav: nav,
        stylesheet: argv.stylesheet,
        lang: argv.lang,
    };
    let updatedLayout = getUpdatedHtmlLayout(html);

    // Write contents to index.html file in output directory
    fs.writeFile(`${argv.output}/index.html`, updatedLayout, 'utf8', (err) => {
        if (err) {
            console.error(
                `The file ${argv.output}/index.html could not be created`
            );
            process.exit(1);
        }
    });
};

module.exports = { setupOutput, getHtmlNav };
