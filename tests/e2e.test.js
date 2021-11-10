const run = require('./run');

describe('E2E integration', () => {
    test('Print error message when no input', async () => {
        const { stderr, stdout, exitCode } = await run();
        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toEqual('');
    });

    test('Prints help message when --help flag used', async () => {
        const { stderr, stdout, exitCode } = await run('--help');
        expect(exitCode).toBe(0);
        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual('');
    });

    test('Prints version when --version flag used', async () => {
        const { stderr, stdout, exitCode } = await run('--version');
        expect(exitCode).toBe(0);
        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual('');
    });

    test('Prints error message when invalid input', async () => {
        const { stderr, stdout, exitCode } = await run(
            '--input',
            'invalidinput'
        );
        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toEqual('');
    });

    test('Prints error message when empty folder', async () => {
        const { stderr, stdout, exitCode } = await run(
            '--input',
            'invalid-folder'
        );
        expect(exitCode).toBe(1);
        expect(stderr).toMatchSnapshot();
        expect(stdout).toEqual('');
    });

    test('Generates HTML file when valid file path', async () => {
        const { stderr, stdout, exitCode } = await run(
            '--input',
            'test-docs/Silver Blaze.txt'
        );
        expect(exitCode).toBe(0);
        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual('');
    });

    test('Generates HTML files when valid folder path', async () => {
        const { stderr, stdout, exitCode } = await run('--input', 'test-docs');
        expect(exitCode).toBe(0);
        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual('');
    });

    test('Generates HTML files when valid file and output paths', async () => {
        const { stderr, stdout, exitCode } = await run(
            '--input',
            'test-docs',
            '--output',
            'empty-folder'
        );
        expect(exitCode).toBe(0);
        expect(stdout).toMatchSnapshot();
        expect(stderr).toEqual('');
    });
});
