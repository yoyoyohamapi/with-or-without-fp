let placeholder = '_';

// curry :: ((a, b) -> c) -> a -> b -> c
const curry = function (func, args) {
    let argsNum = func.length;
    args = args || [];
    return function currified() {
        let concated = args.concat(Array.prototype.slice.call(arguments));
        if (concated.length >= argsNum) {
            return func.apply(this, concated);
        } else {
            return curry(func, concated);
        }
    }
};

// partial :: ((a, b) -> c) -> b -> c
const partial = function () {
    let args = Array.prototype.slice.call(arguments, 0);
    const func = args.shift(); // 首个参数默认是原函数
    return function () {
        const len = args.length;
        let j = 0;
        for (let i = 0; i < len; i++) {
            // 替换占位符
            if (args[i] === placeholder) {
                args[i] = arguments[j++];
            }
        }
        if (j < arguments.length) {
            args = args.concat(Array.prototype.slice.call(arguments, j));
        }
        return func.apply(this, args);
    }
}

// compose:: (Function f, Function g) -> Function z
const compose = function () {
    const funcs = Array.prototype.slice.call(arguments).reverse();
    return function () {
        return funcs.reduce((res, func, index) => {
            if (index === 0) {
                return func.apply(this, res);
            } else {
                return func.call(this, res);
            }
        }, arguments);
    }
};

// property :: String -> a -> b
const property = curry(function (name, obj) {
    return obj[name];
});

// identity :: a->a
const identity = function (obj) {
    return obj;
};

// map :: (a->b) -> [a] -> [b]
const map = curry(function (accumulator, array) {
    return array.map(accumulator);
});

// reduce :: (b->a->b) -> b -> [a] -> b
const reduce = curry(function (accumulator, initVal, array) {
    return array.reduce(accumulator, initVal);
});

// filter :: (a->Bool) -> [a] -> [a]
const filter = curry(function (accumulator, array) {
    return array.filter(accumulator);
});

module.exports = {
    placeholder,
    curry,
    partial,
    compose,
    property,
    identity,
    map,
    reduce,
    filter
};
