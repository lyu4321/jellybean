# Jellybean

Jellybean is a static site generator created using Node.js that converts .txt files into html files.

# Installation

1. Clone this repository
2. Download [Node.js](https://nodejs.org/en/)
3. Run the following commands
```diff
cd jellybean
npm install
```

# Running the Program

```diff
node index.js --input <file>
node index.js --input <folder>
node index.js -i <file>
node index.js -i <folder>
```

# Optional Flags

```diff
node index.js --output <folder>
node index.js -o <folder>
node index.js --stylesheet <URL>
node index.js -s <URL>
```

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
node index.js -i Sherlock-Holmes-Selected-Stories/The Adventure of the Six Napoleans.txt -o customoutput -s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css
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
```
<!doctype html>
<html lang="en">

<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css">
    <meta charset="utf-8">
    <title>Silver Blaze</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>

<body>
    <h1>The Adventure of the Six Napoleans</h1>
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
node index.js -i Sherlock-Holmes-Selected-Stories -o customoutput -s https://cdnjs.cloudflare.com/ajax/libs/tufte-css/1.8.0/tufte.min.css
```

In the Sherlock-Holmes-Selected-Stories folder, if you have the files:<br/>
* index.js
* Silver Blaze.txt
* The Adventure of the Six Napoleans.txt<br/>

In the customoutput folder, the following files will be generated:<br/>
* Silver Blaze.html
* The Adventure of the Six Napoleons.html

# Author

[Leyang Yu](https://github.com/lyu4321)

# License
[MIT](https://choosealicense.com/licenses/mit/)
