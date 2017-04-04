Without Curry
------------------

```js
const accumulator = function (prev, current) {
    return prev + current;
}

console.log([1, 2, 3, 4, 5].reduce(accumulator, 0)); // => 15
console.log([9,14,23].reduce(accumulator, 0)); // => 46
```

With Curry
----------------

```js
const F = require('../fp');

const accumulator = (prev, current) => prev + current;
const sum = F.reduce(accumulator)(0);

console.log(sum([1, 2, 3, 4, 5])); // => 15
console.log(sum([9, 14, 23])); // => 46
```
