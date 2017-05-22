const F = require('../fp');

const prop = F.curry((key, obj) => obj[key]);

const getName = prop('name');
const getAge = prop('age');

const persons = [{
  name: '张三',
  age: 18
}, {
  name: '李四',
  age: 24
}, {
  name: '王五',
  age: 33
}];

const names = persons.map(getName);
const ages = persons.map(getAge);

console.log('names', names); // => ['张三', '李四', '王五']
console.log('ages', ages); // => [18, 24, 33]
