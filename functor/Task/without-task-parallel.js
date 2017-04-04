const fs = require('fs');
const path = require('path');

const getFileSizes = (files, callback) => {
    const sizes = [];
    files.forEach((file) => {
        fs.stat(file, (err, stat) => {
            if (err) {
                callback(err, null);
            } else {
                sizes.push(stat.size);
                if (sizes.length === files.length) {
                    callback(null, sizes);
                }
            }
        });
    });
}

const files = ['co.md', 'koa.md', 'promise.md'].map(filename => path.join(__dirname, filename));
getFileSizes(files, (err, sizes) => {
    if (err) {
        console.error('error:', err);
    } else {
        console.log('sizes:', sizes);
    }
});
// => sizes: [ 5383, 2709, 13939 ]
