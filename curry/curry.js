/**
 * 柯里化函数
 * @param  {Function} func
 * @return {Function} 柯里化后的函数
 */
function curry(func) {
    let argsNum = func.length;
    let args = [];
    return function currified() {
        let concated = args.concat(Array.prototype.slice.call(arguments, 0));
        if(concated.length === argsNum) {
            return func.apply(this, concated);
        } else {
            args = concated;
            return currified;
        }
    }
}

module.exports = curry;
