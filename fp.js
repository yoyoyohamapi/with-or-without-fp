let placeholder = '_';

// curry :: ((a, b) -> c) -> a -> b -> c
const curry = function (func, args) {
    let argsNum = func.length;
    args = args || [];
    return function currified() {
        let concated = args.concat(Array.prototype.slice.call(arguments));
        if (concated.length >= argsNum) {
            return func.apply(this, concated);
        } else {
            return curry(func, concated);
        }
    }
};

// partial :: ((a, b) -> c) -> b -> c
const partial = function () {
    let args = Array.prototype.slice.call(arguments, 0);
    const func = args.shift(); // 首个参数默认是原函数
    return function () {
        const len = args.length;
        let j = 0;
        for (let i = 0; i < len; i++) {
            // 替换占位符
            if (args[i] === placeholder) {
                args[i] = arguments[j++];
            }
        }
        if (j < arguments.length) {
            args = args.concat(Array.prototype.slice.call(arguments, j));
        }
        return func.apply(this, args);
    }
}

// compose:: (Function f, Function g) -> Function z
const compose = function () {
    const funcs = Array.prototype.slice.call(arguments).reverse();
    return function () {
        return funcs.reduce((res, func, index) => {
            if (index === 0) {
                return func.apply(this, res);
            } else {
                return func.call(this, res);
            }
        }, arguments);
    }
};

// property :: String -> a -> b
const property = curry(function (name, obj) {
    return obj[name];
});

// identity :: a->a
const identity = function (obj) {
    return obj;
};

// map :: (a->b) -> [a] -> [b]
const map = curry(function (accumulator, array) {
    return array.map(accumulator);
});

// reduce :: (b->a->b) -> b -> [a] -> b
const reduce = curry(function (accumulator, initVal, array) {
    return array.reduce(accumulator, initVal);
});

// filter :: (a->Bool) -> [a] -> [a]
const filter = curry(function (accumulator, array) {
    return array.filter(accumulator);
});

// last :: [a] -> b
const last = function(array) {
    return array[array.length-1];
};

// head :: [a] -> b
const head = function(array) {
    return array[0];
};

// split :: Regexp -> String -> [a]
const split = curry(function(regex, s) {
    return s.split(regex);
});

// match :: Regexp -> String -> [a]
const match = curry(function(regex, s) {
    return s.match(regex);
});

// nth :: Number -> [a] -> b
const nth = curry(function(nth, arr) {
    if(nth === -1) {
        return arr[arr.length-1];
    } else {
        return arr[nth];
    }
});

// trace -> String -> a -> a
const trace = curry(function(tag, x){
    console.log(tag, x);
    return x;
});

// log -> String -> String -> a -> a
const log = curry(function(level, tag, x) {
    switch(level) {
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
    return 'Identity(' + inspect(this.__value) + ')';
};

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
    return 'Maybe(' + inspect(this.__value) + ')';
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
    return 'Left(' + inspect(this.__value) + ')';
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
    return 'Right(' + inspect(this.__value) + ')';
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
    return 'IO(' + inspect(this.unsafePerformIO) + ')';
}

///// Functor Helper //////////////
const fmap = curry(function (f, m) {
    return m.map(f);
});

const fchain = curry(function (f, m) {
    return m.chain(f);
});

const feither = curry(function (f, g, e) {
    switch(e.constructor) {
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
    IO
};
