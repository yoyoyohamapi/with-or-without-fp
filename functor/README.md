Without Either Functor
----------------------

```js
const players = require('../players');

const getLastNames = players => {
    try {
        const names = players.map(player => player.name);
        const lastNames = names.map(name => name.split(' ')[1]);
        return lastNames;
    } catch (e) {
        console.error('error:', ' players should be an array')
    }
}

console.log('players:', getLastNames(players)); // =>  ['Curry', 'James', 'Paul', 'Thompson', 'Wade' ]
getLastNames({}); // => error:  players should be an array
```

With Either Functor
-------------------

```js
const F = require('../../fp');
const players = require('../players');

const getPlayers = players => !Array.isArray(players) ?
    F.Left.of('players should be an array') :
    F.Right.of(players);

const getLastNames = F.compose(
    F.feither(F.log('error', 'error:'), F.log('debug', 'players:')),
    F.fmap(F.map(F.last)),
    F.fmap(F.map(F.split(' '))),
    F.fmap(F.map(F.property('name'))),
    getPlayers
);

getLastNames(players); // => players: [ 'Curry', 'James', 'Paul', 'Thompson', 'Wade' ]
getLastNames({}); // => error: players should be an array
```

Without IO Monad
----------------

```js
const localStorage = {
    email: 'softshot37@gmail.com',
    nickname: 'softshot'
};

const getUserHostFromCache = (key) =>  {
    let email = localStorage[key];
    return email.match(/\w+@(\w+)\..*/)[1];
}

const print = (tag, x) => console.log(tag, x);

let host = getUserHostFromCache('email');
print('host:', host); // 'host: gmail'
```

With IO Monad
-------------

```js
const F = require('../../fp');

const localStorage = {
    email: 'softshot37@gmail.com'
};

const getCache = (key) => new F.IO(() => localStorage[key]);


const print = F.curry((tag, x) => new F.IO(() => {
    console.log(tag, x);
    return x;
}));

const getUserHostFromCache = F.compose(
    F.fchain(print('host:')),
    F.fmap(F.nth(1)),
    F.fmap(F.match(/\w+@(\w+)\..*/)),
    getCache
);

getUserHostFromCache('email').unsafePerformIO(); // => 'host: gmail'
```

Without Task Monad
------------------

```js
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
```

With Task Monad
---------------

```js
const F = require('../../fp');
const fs = require('fs');
const path = require('path');

const read = path => new F.Task((reject, resolve) =>
    fs.readFile(path, 'utf8', (error, data) => {
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }
    })
);

const write = F.curry((path, data) => new F.Task((reject, resolve) =>
    fs.writeFile(path, data, 'utf8', error => {
        if (error) {
            reject(error);
        } else {
            resolve(data);
        }
    })
));

const getTitle = F.compose(
    F.head,
    F.split('\n')
);

const srcPath = path.join(__dirname, './file.md');
const dstPath = path.join(__dirname, './title.md');

read(srcPath).map(getTitle).chain(write(dstPath)).fork(
    error => console.error('error:', error),
    title => console.log('write:', title)
);
// => 'write: Task Monad'
```

Parallel without Task Applicative
---------------------------------

```js
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
```

Parallel with Task Applicative
------------------------------

```js
const fs = require('fs');
const path = require('path');
const F = require('../../fp');

const files = ['co.md', 'koa.md', 'promise.md'].map(filename => path.join(__dirname, filename));

const getFileSize = (file) => F.Task.of((reject, resolve) =>
    fs.stat(file, (err, stat) => err ? reject(err) : resolve(stat.size))
);

const totalSize = F.curry((size1, size2, size3) => size1 + size2 + size3);

const totalTask = F.lift(
    totalSize,
    getFileSize(files[0]),
    getFileSize(files[1]),
    getFileSize(files[2])
);

totalTask.fork(
    error => console.error('error:', error),
    total => console.log('total:', total)
);
// => sizes: 22497
```
