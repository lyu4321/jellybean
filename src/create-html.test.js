const { getHtmlNav } = require('./create-html');

describe('Unit tests for getHtmlNav', () => {
    test('Creates navbar with link to index page', () => {
        expect(getHtmlNav()).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li></ul></div>`
        );
    });

    test('Creates navbar with link to index and user-defined pages (single file)', () => {
        expect(getHtmlNav('Silver Blaze.txt')).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li><li><a href='./Silver Blaze.html'>Silver Blaze</a></li></ul></div>`
        );
    });

    test('Creates navbar with link to index and user-defined pages (array of files)', () => {
        expect(
            getHtmlNav([
                'Silver Blaze.txt',
                'The Adventure of the Six Napoleans.txt',
            ])
        ).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li><li><a href='./Silver Blaze.html'>Silver Blaze</a></li><li><a href='./The Adventure of the Six Napoleans.html'>The Adventure of the Six Napoleans</a></li></ul></div>`
        );
    });

    test('Creates navbar with link to index page (empty array)', () => {
        expect(getHtmlNav([])).toBe(
            `<div><ul><li><a href='./index.html'>Home</a></li></ul></div>`
        );
    });
});
