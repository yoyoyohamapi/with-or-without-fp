const fs = require('fs');
const path = require('path');
const F = require('../../fp');

const files = ['co.md', 'koa.md', 'promise.md'].map(filename => path.join(__dirname, filename));

const getFileSize = (file) => F.Task.of((reject, resolve) =>
    fs.stat(file, (err, stat) => err ? reject(err) : resolve(stat.size))
);

const totalSize = F.curry((size1, size2, size3) => size1 + size2 + size3);

const totalTask = F.lift(totalSize, getFileSize(files[0]), getFileSize(files[1]), getFileSize(files[2]));


totalTask.fork(
    error => console.error('error:', error),
    total => console.log('total:', total)
);
// => sizes: 22497
