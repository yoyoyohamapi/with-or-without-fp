const F = require('../fp');

const parseInt10 = F.partial(parseInt, F._, 10);
const parseInt16 = F.partial(parseInt, F._, 16)
const parseInt2 = F.partial(parseInt, F._, 2);

console.log((parseInt10('10'))); // => 10
console.log((parseInt16('10'))); // => 16
console.log((parseInt2('10'))); // => 2
