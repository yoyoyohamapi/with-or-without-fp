const fs = require('fs');
const path = require('path');

const read = function (path, callback) {
    return fs.readFile(path, 'utf8', callback);
}

const write = function (path, data, callback) {
    return fs.writeFile(path, data, 'utf8', callback);
}

const getTitle = function (content) {
    return content.split('\n')[0];
}

const srcPath = path.join(__dirname, './file.md');
const dstPath = path.join(__dirname, './title.md');

read(srcPath, (error, data) => {
    if (error) {
        console.error('read error:', error);
    } else {
        const title = getTitle(data);
        write(dstPath, title, (error) => {
            if(error) {
                console.error('write error:', error);
            } else {
                console.log('write:', title); // => 'write: Task Monad'
            }
        });
    }
})
