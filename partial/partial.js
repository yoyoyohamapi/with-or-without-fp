/**
 * 偏函数
 * 假定占位符为'_'
 * @return {Function}
 */
function partial() {
    let args = Array.prototype.slice.call(arguments, 0);
    const func = args.shift(); // 收个参数默认是原函数
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
            args = args.concat(Array.prototype.slice.call(arguments,j));
        }
        return func.apply(this, args);
    }
}

module.exports = partial;
