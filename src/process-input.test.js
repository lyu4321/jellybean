const checkUserInput = require('./process-input');

describe('Unit tests for checkUserInput', () => {
    test('Returns false when no arguments', () => {
        expect(checkUserInput()).toBe(false);
    });

    test('Returns false when invalid config file', () => {
        expect(
            checkUserInput({
                config: 'test-docs/invalid-config.json',
            })
        ).toBe(false);
    });

    test('Returns true when valid config file', () => {
        expect(
            checkUserInput({
                config: 'test-docs/config.json',
            })
        ).toBe(true);
    });

    test('Returns false when invalid input file', () => {
        expect(
            checkUserInput({
                input: ['test-docs/test.js'],
            })
        ).toBe(false);
    });

    test('Returns true when valid input file', () => {
        expect(
            checkUserInput({
                input: ['test-docs/Silver', 'Blaze.txt'],
                stylesheet:
                    'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
            })
        ).toBe(true);
    });

    test('Returns false when invalid output directory', () => {
        expect(
            checkUserInput({
                input: ['test-docs/Silver', 'Blaze.txt'],
                stylesheet:
                    'https://cdn.jsdelivr.net/npm/water.css@2/out/water.css',
                output: 'non-existent-folder',
            })
        ).toBe(false);
    });

    test('Returns true when valid input and output directory', () => {
        expect(
            checkUserInput({
                input: ['test-docs'],
                output: 'test-docs/test-folder',
            })
        ).toBe(true);
    });

    test('Returns false when empty input directory', () => {
        expect(
            checkUserInput({
                input: ['invalid-folder'],
                output: 'test-docs/test-folder',
            })
        ).toBe(false);
    });
});
