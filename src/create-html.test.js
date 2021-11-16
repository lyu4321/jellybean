const {
    getHtmlLayout,
    getUpdatedHtmlLayout,
    getHtmlNav,
    getHtmlTitleBody,
} = require('./create-html');

describe('Unit tests for getHtmlNav', () => {
    test('Should create navbar with link to index page (no args)', () => {
        expect(getHtmlNav()).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li></ul></div>`
        );
    });

    test('Should create navbar with link to index and user-defined pages (string arg)', () => {
        expect(getHtmlNav('Silver Blaze.txt')).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li><li><a href='./Silver Blaze.html'>Silver Blaze</a></li></ul></div>`
        );
    });

    test('Should create navbar with link to index and user-defined pages (string array arg)', () => {
        expect(
            getHtmlNav([
                'Silver Blaze.txt',
                'The Adventure of the Six Napoleans.txt',
            ])
        ).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li><li><a href='./Silver Blaze.html'>Silver Blaze</a></li><li><a href='./The Adventure of the Six Napoleans.html'>The Adventure of the Six Napoleans</a></li></ul></div>`
        );
    });

    test('Should create navbar with link to index page (empty array arg)', () => {
        expect(getHtmlNav([])).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li></ul></div>`
        );
    });
});

const html = `<!DOCTYPE html>
<html lang="en-CA">
    <head>
        <link rel="stylesheet" href="{stylesheet}" />
        <meta charset="utf-8" />
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>

    <body>
        <div id="nav">{nav}</div>
        <h1>{title}</h1>
        {body}
    </body>
</html>
`;

const expected = `<!DOCTYPE html>
<html lang="en-CA">
    <head>
        <link rel="stylesheet" href="style.css" />
        <meta charset="utf-8" />
        <title> </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>

    <body>
        <div id="nav"> </div>
        <h1> </h1>
         
    </body>
</html>
`;

describe('Unit tests for getHtmlLayout', () => {
    test('Should return default HTML template', () => {
        expect(getHtmlLayout()).toBe(html);
    });
});

describe('Unit tests for getUpdatedHtmlLayout', () => {
    test('Should replace placeholders with blank space', () => {
        expect(
            getUpdatedHtmlLayout({
                layout: html,
            })
        ).toBe(expected);
    });

    test('Should replace stylesheet placeholder with stylesheet url', () => {
        let result = getUpdatedHtmlLayout({
            layout: html,
            stylesheet:
                'https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css',
        });
        expect(
            result.includes(
                `<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css" />`
            )
        ).toBeTruthy();
    });

    test('Should replace title placeholder with title text', () => {
        let result = getUpdatedHtmlLayout({
            layout: html,
            title: 'Title',
        });
        expect(result.includes(`<h1>Title</h1>`)).toBeTruthy();
    });

    test('Should replace nav placeholder with nav html', () => {
        let result = getUpdatedHtmlLayout({
            layout: html,
            nav: `<div><ul><li><a href='./index.html'>Home</a></li></ul></div>`,
        });
        expect(
            result.includes(
                `<div id="nav"><div><ul><li><a href='./index.html'>Home</a></li></ul></div></div>`
            )
        ).toBeTruthy();
    });

    test('Should replace body placeholder with body text', () => {
        let result = getUpdatedHtmlLayout({
            layout: html,
            body: '<p>Body Text</p>',
        });
        expect(
            result.includes(`<body>
        <div id="nav"> </div>
        <h1> </h1>
        <p>Body Text</p>
    </body>`)
        ).toBeTruthy();
    });

    test('Should replace lang placeholder with lang', () => {
        let result = getUpdatedHtmlLayout({
            layout: html,
            lang: 'fr-CA',
        });
        expect(result.includes(`<html lang="fr-CA">`)).toBeTruthy();
    });
});

describe('Unit tests for getHtmlTitleBody', () => {
    test('Should return an object of title and body for text file with title', () => {
        const txtFile = `Sample Title\n\n\nThis is a sample text file.`;

        const expected = {
            title: 'Sample Title',
            body:
                '<h1>Sample Title</h1>\n' +
                '<p> This is a sample text file.</p>\n',
        };
        expect(getHtmlTitleBody(txtFile, true)).toEqual(expected);
    });

    test('Should return an object of empty title and body for text file with no title', () => {
        const txtFile = `This is a sample text file.`;

        const expected = {
            title: '',
            body: '<p>This is a sample text file.</p>\n',
        };
        expect(getHtmlTitleBody(txtFile, true)).toEqual(expected);
    });

    test('Should return an object containing empty title and body for markdown file', () => {
        const mdFile = `# This is a heading`;
        const expected = {
            title: '',
            body: '<h1>This is a heading</h1>\n',
        };
        expect(getHtmlTitleBody(mdFile, false)).toEqual(expected);
    });
});
