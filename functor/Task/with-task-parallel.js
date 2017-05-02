const fs = require('fs');
const path = require('path');
const F = require('../../fp');

const files = ['co.md', 'koa.md', 'promise.md'].map(filename => path.join(__dirname, filename));

const getFileSize = (file) => F.Task.of((reject, resolve) =>
    fs.stat(file, (err, stat) => err ? reject(err) : resolve(stat.size))
);

const totalSize = (...sizes) => F.reduce((prev, curr) => prev + curr, 0, sizes);

const totalTask = F.Task.of(totalSize)
    .ap(getFileSize(files[0]))
    .ap(getFileSize(files[1]))
    .ap(getFileSize(files[2]));

totalTask.fork(
    error => console.error('error:', error),
    total => console.log('total:', total)
);
// => sizes: [ 5383, 2709, 13939 ]
