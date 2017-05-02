const fs = require('fs');
const path = require('path');

const totalSize = (files, callback) => {
    const sizes = new Array(files.length);
    let completed = files.length;
    files.forEach((file, index) => {
        fs.stat(file, (err, stat) => {
            if (err) {
                callback(err, null);
            } else {
                sizes[index] = stat.size;
                if (--completed === 0) {
                    const total = sizes.reduce((prev, curr) => prev + curr, 0);
                    callback(null, total);
                }
            }
        });
    });
}

const files = ['co.md', 'koa.md', 'promise.md'].map(
    filename => path.join(__dirname, filename)
);

totalSize(files, (err, total) => {
    if (err) {
        console.error('error:', err);
    } else {
        console.log('total:', total);
    }
});
// => sizes: 22497
