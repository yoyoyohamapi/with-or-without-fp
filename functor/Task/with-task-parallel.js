const fs = require('fs');
const path = require('path');
const F = require('../../fp');

const getFileSize = (file) => F.Task.of((reject, resolve) =>
    fs.stat(file, (err, stat) => err ? reject(err) : resolve(stat.size))
);

const getFileSizes = files => {
    const tasks = files.map(getFileSize);
    return F.Task.all(tasks);
};

const files = ['co.md', 'koa.md', 'promise.md'].map(filename => path.join(__dirname, filename));
getFileSizes(files).fork(
    error => console.error('error:', error),
    sizes => console.log('sizes:', sizes)
);
// => sizes: [ 5383, 2709, 13939 ]
