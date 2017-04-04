const fs = require('fs');
const path = require('path');

const read = (path, callback) => fs.readFile(path, 'utf8', callback);

const write = (path, data, callback) => fs.writeFile(path, data, 'utf8', callback);

const getTitle = (content) => content.split('\n')[0];

const srcPath = path.join(__dirname, './file.md');
const dstPath = path.join(__dirname, './title.md');

read(srcPath, (error, data) => {
    if (error) {
        console.error('read error:', error);
    } else {
        const title = getTitle(data);
        write(dstPath, title, error => {
            if (error) {
                console.error('write error:', error);
            } else {
                console.log('write:', title); // => 'write: Task Monad'
            }
        });
    }
});
