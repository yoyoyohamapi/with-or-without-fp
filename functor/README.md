Without Either Functor
---------------

```js
const players = require('../players');

function getLastNames(players) {
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
-----------------

```js
const F = require('../../fp');
const players = require('../players');

const getPlayers = function (players) {
    if (!Array.isArray(players)) {
        return F.Left.of('players should be an array');
    } else {
        return F.Right.of(players);
    }
}

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
-------------

```js
const localStorage = {
    email: 'softshot37@gmail.com',
    nickname: 'softshot'
};

const getUserHostFromCache = function (key) {
    let email = localStorage[key];
    return email.match(/\w+@(\w+)\..*/)[1];
}

const print = function(tag, x) {
    console.log(tag, x);
}
let host = getUserHostFromCache('email');
print('host:', host); // 'host: gmail'
```

With IO Monad
--------------

```js
const F = require('../../fp');

const localStorage = {
    email: 'softshot37@gmail.com'
};

const getCache = function (key) {
    return new F.IO(() => {
        return localStorage[key];
    });
};

const print = F.curry(function (tag, x) {
    return new F.IO(() => {
        console.log(tag, x);
        return x;
    });
});

const getUserHostFromCache = F.compose(
    F.fchain(print('host:')),
    F.fmap(F.nth(1)),
    F.fmap(F.match(/\w+@(\w+)\..*/)),
    getCache
);

getUserHostFromCache('email').unsafePerformIO(); // => 'host: gmail'
```

Without Task Monad
-----------------------

```js
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
```

With Task Monad
------------------

```js
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
```
