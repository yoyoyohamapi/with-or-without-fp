let placeholder = '_';

/**
 * 柯里化函数
 * @param  {Function} func
 * @return {Function}
 */
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

/**
 * 偏函数
 * @return {Function}
 */
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

/**
 * 函数组合
 * @return {Function}
 */
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

/**
 * 获得对象属性
 * @return {Function}
 */
const property = curry(function (name, obj) {
    return obj[name];
});

/**
 * identity
 * @param  {Obejct} obj
 * @return {Obejct}
 */
const identity = function (obj) {
    return obj;
};

/**
 * map
 * @param {Function} accumulator
 * @return {Function}
 */
const map = curry(function (accumulator, array) {
    return array.map(accumulator);
});

/**
 * reduce
 * @param {Function} accumulator
 * @param {Object} initVal
 * @return {Function}
 */
const reduce = curry(function (accumulator, initVal, array) {
    return array.reduce(accumulator, initVal);
});

/**
 * filter
 * @param {Function} accumulator
 * @return {Function}
 */
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
