let placeholder = '_';

// curry :: ((a, b) -> c) -> a -> b -> c
const curry = (f, arr = []) => (...args) =>
    (a => a.length >= f.length ? f(...a) : curry(f, a))([...arr, ...args])

// partial :: ((a, b) -> c) -> b -> c
const partial = (...args) => {
    const func = args.shift();
    return (...a) => {
        const len = args.length;
        let j = 0;
        for (let i = 0; i < len; i++) {
            if (args[i] === placeholder) {
                args[i] = a[j++];
            }
        }
        if (j < a.length) {
            args = [...args, ...a];
        }
        return func(...args);
    }
}

// compose:: (Function f, Function g) -> Function z
const compose = (...funcs) => x => funcs.reduceRight((input, func) => func(input), x);

// property :: String -> a -> b
const property = curry((prop, obj) => obj[prop]);

// identity :: a->a
const identity = obj => obj;

// map :: (a->b) -> [a] -> [b]
const map = curry((fn, f) => f.map(fn));

// reduce :: (b->a->b) -> b -> [a] -> b
const reduce = curry((accumulator, initVal, f) => f.reduce(accumulator, initVal));

// filter :: (a->Bool) -> [a] -> [a]
const filter = curry((fn, f) => f.filter(fn));

// last :: [a] -> b
const last = array => array[array.length - 1];

// head :: [a] -> b
const head = array => array[0];

// split :: Regexp -> String -> [a]
const split = curry((regex, s) => s.split(regex));

// match :: Regexp -> String -> [a]
const match = curry((regex, s) => s.match(regex));

// nth :: Number -> [a] -> b
const nth = curry((nth, arr) => nth < 0 ? arr[arr.length + nth] : arr[nth]);

// trace -> String -> a -> a
const trace = curry((tag, x) => {
    console.log(tag, x);
    return x;
});

// log -> String -> String -> a -> a
const log = curry((level, tag, x) => {
    switch (level) {
        case 'error':
            console.error(tag, x);
            break;
        case 'debug':
        default:
            console.log(tag, x);
            break;
    }
    return x;
});

//////////////// Functors //////////////////////
// Identity
const Identity = function (x) {
    this.__value = x;
};

Identity.of = function (x) { return new Identity(x); };

Identity.prototype.map = function (f) {
    return Identity.of(f(this.__value));
};

Identity.prototype.inspect = function () {
    return `Identity(${inspect(this.__value)})`;
};

Identity.prototype.toString = function () {
    return `Identity(${this.__value})`;
}

// Maybe
const Maybe = function (v) {
    this.__value = v;
}

Maybe.of = function (v) {
    return new Maybe(v);
}

Maybe.prototype.isNothing = function () {
    return this.__value === null || this.value === undefined;
}

Maybe.prototype.map = function (f) {
    return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
}

Maybe.prototype.join = function () {
    return this.isNothing() ? Maybe.of(null) : this.__value;
}

Maybe.prototype.chain = function (f) {
    return this.map(f).join();
}

Maybe.prototype.ap = function (other) {
    return this.isNothing() ? Maybe.of(null) : other.map(this.__value);
}

Maybe.prototype.inspect = function () {
    return `Maybe(${inspect(this.__value)})`;
}

Maybe.prototype.toString = function () {
    return `Maybe(${this.__value})`;
}

// Left
const Left = function (v) {
    this.__value = v;
}

Left.of = function (v) {
    return new Left(v);
}

Left.prototype.map = function (f) {
    // Left functor 会短路之后的一切操作
    return this;
}

Left.prototype.join = function () {
    return this;
}

Left.prototype.chain = function (f) {
    return this;
}

Left.prototype.ap = function (other) {
    return this;
}

Left.prototype.inspect = function () {
    return `Left(${inspect(this.__value)})`;
}

Left.prototype.toString = function () {
    return `Left(${this.__value})`;
}

// Right
const Right = function (v) {
    this.__value = v;
}

Right.of = function (v) {
    return new Right(v);
}

Right.prototype.map = function (f) {
    return Right.of(f(this.__value));
}

Right.prototype.join = function () {
    return this.__value;
}

Right.prototype.chain = function (f) {
    return this.map(f).join();
}

Right.prototype.ap = function (other) {
    return other.map(this.__value);
}

Right.prototype.inspect = function () {
    return `Right(${inspect(this.__value)})`;
}

Right.prototype.toString = function () {
    return `Right(${this.__value})`;
}

// Either
Either = function () {}

Either.of = function (v) {
    return Right.of(v);
}

// IO
const IO = function (f) {
    this.unsafePerformIO = f;
}

IO.prototype.of = function (v) {
    return new IO(function () {
        return v;
    });
}

IO.prototype.map = function (f) {
    return new IO(compose(f, this.unsafePerformIO));
}

IO.prototype.join = function () {
    return this.unsafePerformIO();
}

IO.prototype.chain = function (f) {
    return this.map(f).join();
}

IO.prototype.ap = function (other) {
    return other.map(this.unsafePerformIO)
}

IO.prototype.inspect = function () {
    return `IO(${inspect(this.unsafePerformIO)})`;
}

IO.prototype.toString = function () {
    return `IO(${this.unsafePerformIO})`;
}

const Task = function (f, tasks, cb) {
    this.fork = f;
    this.tasks = tasks;
    this.cb = cb;
}

Task.of = function (f) {
    return new Task(f);
}

Task.prototype.map = function (f) {
    let self = this;
    return new Task((reject, resolve) =>
        self.fork(error => reject(error), data => resolve(data))
    );
}

Task.prototype.chain = function (f) {
    let self = this;
    return new Task((reject, resolve) =>
        self.fork(error => reject(error), data => f(data).fork(reject, resolve))
    );
}

Task.prototype.ap = function (task) {
    const cb = this.cb === void 0 ? this.fork : this.cb;
    const tasks = this.tasks === void 0 ? [task] : this.tasks.map(identity).concat([task]);
    const results = new Array(tasks.length);
    let completed = tasks.length;
    return new Task((reject, resolve) =>
        tasks.forEach((task, index) =>
            task.fork(error => reject(error), data => {
                results[index] = data;
                if (--completed === 0) {
                    resolve(cb.apply(null, results));
                }
            })
        ), tasks, cb);
}

Task.all = function (tasks) {
    const results = new Array(tasks.length);
    let completed = tasks.length;
    return new Task((reject, resolve) =>
        tasks.forEach((task, index) =>
            task.fork(error => reject(error), data => {
                results[index] = data;
                if (--completed === 0) {
                    resolve(results);
                }
            })
        )
    );
}

///// Functor Helper //////////////
const fmap = curry((f, m) => m.map(f));

const fchain = curry((f, m) => m.chain(f));

const feither = curry((f, g, e) => {
    switch (e.constructor) {
        case Left:
            return f(e.__value);
        case Right:
            return g(e.__value);
    }
});

inspect = function (x) {
    return (x && x.inspect) ? x.inspect() : x;
};

module.exports = {
    placeholder,
    curry,
    partial,
    compose,
    property,
    identity,
    map,
    reduce,
    filter,
    last,
    head,
    split,
    match,
    nth,
    trace,
    log,
    Identity,
    fmap,
    fchain,
    feither,
    Maybe,
    Left,
    Right,
    Either,
    IO,
    Task
};
