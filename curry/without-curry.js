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

const names = persons.map(person => person.name);
const ages = persons.map(person => person.age);

console.log('names', names); // => ['张三', '李四', '王五']
console.log('ages', ages); // => [18, 24, 33]
