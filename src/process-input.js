const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const { setupOutput } = require('./create-html');

/**
 * Check the user input
 * @param {object} argv => command line args
 * @return {boolean} => return true if the user input is valid, else false
 */
const checkUserInput = (argv) => {
    if (argv) {
        if (argv.input) {
            argv.input = argv.input.join(' ');
        }

        if (argv.config) {
            if (
                !fs.existsSync(argv.config) ||
                !fs.statSync(argv.config).isFile() ||
                path.extname(argv.config) != '.json'
            ) {
                console.error('JSON config file is required');
                return false;
            } else {
                // Get options from json file and save them in argv
                argv = jsonfile.readFileSync(argv.config, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        }

        // Set the output directory
        if (argv.output && !fs.existsSync(argv.output)) {
            console.error('Valid output directory is required');
            return false;
        } else if (!argv.output) {
            argv.output = 'dist';
        }

        // Set the stylesheet
        if (!argv.stylesheet) {
            argv.stylesheet = 'style.css';
        }

        // Set the input
        let input = argv.input;
        if (!input || !fs.existsSync(input)) {
            console.error('Input file or folder is required');
            return false;
        } else {
            if (
                fs.statSync(input).isFile() &&
                (path.extname(input) == '.txt' || path.extname(input) == '.md')
            ) {
                setupOutput(argv);
            } else if (fs.statSync(input).isDirectory()) {
                try {
                    let files = fs.readdirSync(input);
                    let filesArray = files.filter(
                        (f) =>
                            path.extname(f) == '.txt' ||
                            path.extname(f) == '.md'
                    );
                    if (filesArray.length == 0) {
                        console.error('Input directory is empty.');
                        process.exit(1);
                    } else {
                        setupOutput(argv, filesArray);
                    }
                } catch (e) {
                    console.error(`The directory ${input} could not be read`);
                    process.exit(1);
                }
            } else {
                return false;
            }
        }
        return true;
    }
    return false;
};

module.exports = checkUserInput;
