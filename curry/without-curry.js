const accumulator = function (prev, current) {
    return prev + current;
}

console.log([1, 2, 3, 4, 5].reduce(accumulator, 0)); // => 15
console.log([9,14,23].reduce(accumulator, 0)); // => 46
