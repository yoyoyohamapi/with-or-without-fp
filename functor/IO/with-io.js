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
