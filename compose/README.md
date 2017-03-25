Without Compose
-----------

```js
const students = [{
    name: '张三',
    score: 73,
    sex: 'male',
}, {
    name: '刘丽',
    score: 62,
    sex: 'female'
}, {
    name: '李四',
    score: 93,
    sex: 'male'
},{
    name: '王五',
    score: 100,
    sex: 'male'
}];


const isExcellent = function(student) {
    return student.score > 80;
}

const excellentStudentNames = function(students) {
    let excellents = students.filter(isExcellent);
    return excellents.map((excellent)=>{
        return excellent.name;
    });
}

console.log(excellentStudentNames(students)); // => ['李四','王五']
```

With Compose
---------------

```js
const F = require('../fp');

const students = [{
    name: '张三',
    score: 73,
    sex: 'male',
}, {
    name: '刘丽',
    score: 62,
    sex: 'female'
}, {
    name: '李四',
    score: 93,
    sex: 'male'
},{
    name: '王五',
    score: 100,
    sex: 'male'
}];


const isExcellent = function(student) {
    return student.score > 80;
}

const excellentStudentNames = F.compose(
    F.map(F.property('name')),
    F.filter(isExcellent)
);

console.log(excellentStudentNames(students)); // => ['李四','王五']
```
