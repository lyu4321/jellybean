# Jellybean

From one small program, you can create an entire website. Jellybean is a static site generator created in Node.js that lets you easily convert your text/markdown files into HTML.

# Main Features

1. A single text/markdown file or folder containing multiple files can be converted into HTML files. 
2. The title of the page, which is the first line of a file if followed by two blank lines, will be automatically generated.
3. Generated files are stored in the 'dist' folder and style is provided by 'style.css'. The default language is set to 'en-CA'. Custom folders, styles, and languages can be specified using [optional flags](https://github.com/lyu4321/jellybean#optional-flags).
4. Markdown files will be parsed for [markdown syntax](https://github.com/lyu4321/jellybean#additional-support-for-md-markdown-files) in order to generate the proper HTML. 

# Installation

1. Clone this repository
2. Download [Node.js](https://nodejs.org/en/)
3. Run the following commands
```diff
cd jellybean
npm install
```

# Running the Program

Path to an existing text/markdown file
```diff
node index.js --input <file>
node index.js -i <file>
```

Path to an existing folder containing multiple files
```diff
node index.js --input <folder>
node index.js -i <folder>
```

The --input/-i flag is required, followed by a path to either an existing text/markdown file or folder containing multiple files. The contents of each file will be converted into an HTML file with the same name and stored in the output directory specified or in the 'dist' directory if no output directory is specified. If a folder contains non-text/markdown files, these files will not be converted into HTML. 

# Optional Flags

| Flag  | Description |
| ------------- | ------------- |
| `--output/-o <folder>` | Path to an output directory where generated pages will be stored  |
| `--stylesheet/-s <URL>`  | Stylesheet URL to be used to style the generated pages  |
| `--lang <string>` | The lang attribute for the ```<html>``` tag of each page, describes the language of a page, set to 'en-CA' by default |

# Getting Help

```diff
node index.js --help
node index.js -h
```

# Getting the Version

```diff
node index.js --version
node index.js -v
```

# Example Using a File

```diff
node index.js -i Sherlock-Holmes-Selected-Stories/The Adventure of the Six Napoleans.txt -l en-US -o customoutput -s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css
```

Original File:<br/>
Sherlock-Holmes-Selected-Stories/The Adventure of the Six Napoleans.txt
```diff
THE ADVENTURE OF THE SIX NAPOLEONS


It was no very unusual thing for Mr. Lestrade, of Scotland Yard,
to look in upon us of an evening, and his visits were welcome to
Sherlock Holmes, for they enabled him to keep in touch with all
that was going on at the police headquarters. In return for the
news which Lestrade would bring, Holmes was always ready to
listen with attention to the details of any case upon which the
detective was engaged, and was able occasionally, without any
active interference, to give some hint or suggestion drawn from
his own vast knowledge and experience.
```

Generated File:<br/>
customoutput/The Adventure of the Six Napoleans.html
```html
<!doctype html>
<html lang="en-US">

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css">
    <meta charset="utf-8">
    <title>THE ADVENTURE OF THE SIX NAPOLEONS</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <div>
        <ul>
            <li><a href='./index.html'>Home</a></li>
            <li><a href='./The Adventure of the Six Napoleans.html'>The Adventure of the Six Napoleans</a></li>
        </ul>
    </div>
    <h1>THE ADVENTURE OF THE SIX NAPOLEONS</h1>
    <p> 
        It was no very unusual thing for Mr. Lestrade, of Scotland Yard,
        to look in upon us of an evening, and his visits were welcome to
        Sherlock Holmes, for they enabled him to keep in touch with all
        that was going on at the police headquarters. In return for the
        news which Lestrade would bring, Holmes was always ready to
        listen with attention to the details of any case upon which the
        detective was engaged, and was able occasionally, without any
        active interference, to give some hint or suggestion drawn from
        his own vast knowledge and experience.
     </p>

</body>

</html>
```

# Example Using a Folder

```diff
node index.js -i Sherlock-Holmes-Selected-Stories
```

In the Sherlock-Holmes-Selected-Stories folder, if you have the files:<br/>
* notatextfile.js
* Silver Blaze.txt
* The Adventure of the Six Napoleans.txt<br/>

In the dist folder, the following files will be generated:<br/>
* index.html
* Silver Blaze.html
* style.css
* The Adventure of the Six Napoleons.html

# Additional Support for Markdown Files

For markdown files (.md), the program will parse markdown to HTML tags.

| MD File         | HTML File             | Webpage             |
| --------------- | --------------------- | ------------------- |
| `# H1 Heading`  | `<h1>H1 Heading</h1>` | <h1>H1 Heading</h1> |
| `## H2 Heading` | `<h2>H2 Heading</h2>` | <h2>H2 Heading</h2> |
| `### H3 Heading` | `<h3>H3 Heading</h3>` | <h3>H3 Heading</h3>  |

# Example Using a Markdown File

Original File:<br/>
README.md

```
# Jellybean

From one small program, you can create an entire website. Jellybean is a static site generator created in Node.js that lets you easily convert your text/markdown files into HTML.

## Main Features

1. A single text/markdown file or folder containing multiple files can be converted into HTML files.
2. The title of the page, which is the first line of a file if followed by two blank lines, will be automatically generated.
3. Generated files are stored in the 'dist' folder and style is provided by 'style.css' by default. Custom folders and styles can be specified using optional flags (see below).

### Installation

1. Clone this repository
2. Download [Node.js](https://nodejs.org/en/)
3. Run the following commands

```

Generated File:<br/>
README.html

```html
<!doctype html>
<html lang="en-CA">

<head>
    <link rel="stylesheet" href="style.css">
    <meta charset="utf-8">
    <title></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <div><ul><li><a href='./index.html'>Home</a></li><li><a href='./README.html'>README</a></li></ul></div>
    <h1></h1>
    <h1>Jellybean</h1>
<p>From one small program, you can create an entire website. Jellybean is a static site generator created in Node.js that lets you easily convert your text/markdown files into HTML.</p>
<h2>Main Features</h2>
<p>1. A single text/markdown file or folder containing multiple files can be converted into HTML files. 2. The title of the page, which is the first line of a file if followed by two blank lines, will be automatically generated.
3. Generated files are stored in the 'dist' folder and style is provided by 'style.css' by default. Custom folders and styles can be specified using optional flags (see below).</p>
<h3>Installation</h3>
<p>1. Clone this repository 2. Download [Node.js](https://nodejs.org/en/)
3. Run the following commands</p>

</body>

</html>
```


# Live Demo

[https://lyu4321.github.io/jellybean](https://lyu4321.github.io/jellybean)

# Author

[Leyang Yu](https://github.com/lyu4321)

# License
[MIT](https://choosealicense.com/licenses/mit/)
