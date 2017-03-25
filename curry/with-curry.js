const curry = require('./curry');

function reduce(accumulator, initVal, collection) {
    return collection.reduce(accumulator, initVal);
}
const accumulator = function (prev, current) {
    return prev + current;
}
const sum = curry(reduce)(accumulator)(0);
console.log(sum([1,2,3,4,5])); // => 15
console.log(sum([9,14,23])); // => 46
