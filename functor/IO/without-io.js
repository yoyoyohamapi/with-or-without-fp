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
