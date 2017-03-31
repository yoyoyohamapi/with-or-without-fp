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
    return new F.IO(function () {
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
