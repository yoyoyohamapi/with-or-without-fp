Without Curry
------------------

```js
function reduce(accumulator, initVal, collection) {
    return collection.reduce(accumulator, initVal);
}
const accumulator = function (prev, current) {
    return prev + current;
}

console.log(reduce(accumulator, 0, [1, 2, 3, 4, 5])); // => 15
console.log(reduce(accumulator, 0, [9, 14, 23])); // => 46
```

With Curry
----------------

```js
const F = require('../fp');

function reduce(accumulator, initVal, collection) {
    return collection.reduce(accumulator, initVal);
}
const accumulator = function (prev, current) {
    return prev + current;
}
const sum = F.curry(reduce)(accumulator)(0);
console.log(sum([1,2,3,4,5])); // => 15
console.log(sum([9,14,23])); // => 46
```
