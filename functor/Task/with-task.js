const F = require('../../fp');
const fs = require('fs');
const path = require('path');

const read = function (path) {
    return new F.Task((reject, resolve) => {
        fs.readFile(path, 'utf8', (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
}

const write = F.curry((path, data) => {
    return new F.Task((reject, resolve) => {
        fs.writeFile(path, data, 'utf8', (error) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
});

const getTitle = F.compose(
    F.head,
    F.split('\n')
);

const srcPath = path.join(__dirname, './file.md');
const dstPath = path.join(__dirname, './title.md');

read(srcPath).map(getTitle).chain(write(dstPath)).fork((error) => {
    console.error('error:', error);
}, function (title) {
    console.log('write:', title);
});
// => 'write: Task Monad'
