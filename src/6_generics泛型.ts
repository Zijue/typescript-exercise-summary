export { };

/* ---------- 泛型 ---------- */
//泛型是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
//泛型<T>作用域只限于函数内部使用

/* ---------- 泛型函数 ---------- */
namespace a {
    function createArray<T>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    }
    let result = createArray<string>(3, 'x');
    console.log(result);
}

/* ---------- 类数组 ---------- */
namespace b {
    function sum(..._: any[]) {
        let args: IArguments = arguments;
        for (let i = 0; i < args.length; i++) {
            console.log(args[i]);
        }
    }
    sum(1, 2, 3);

    let root = document.getElementById('root');
    let children: HTMLCollection = (root as HTMLElement).children;
    children.length;
    let nodeList: NodeList = (root as HTMLElement).childNodes;
    nodeList.length;
}

/* ---------- 泛型类 ---------- */
namespace c {
    class MyArray<T> {
        private list: T[] = [];
        add(value: T) {
            this.list.push(value);
        }
        getMax(): T {
            let result = this.list[0];
            for (let i = 0; i < this.list.length; i++) {
                if (this.list[i] > result) {
                    result = this.list[i];
                }
            }
            return result;
        }
    }
    let arr = new MyArray<number>();
    arr.add(1); arr.add(2); arr.add(3);
    let ret = arr.getMax();
    console.log(ret);
}

/* ---------- 泛型与new ---------- */
namespace d {
    function factory<T>(type: { new(): T }): T {
        return new type(); // This expression is not constructable.
    }
    class Person { };
    let p = factory<Person>(Person);
    console.log(p);
}

/* ---------- 泛型接口 ---------- */
//泛型接口可以用来约束函数
namespace e {
    interface Calculate {
        <T extends number>(a: T, b: T): any
    }
    let add: Calculate = function <T extends number>(a: T, b: T) {
        return a + b;
    }
    add<number>(1, 2);
}

/* ---------- 多个类型参数 ---------- */
namespace f {
    //泛型可以有多个
    function swap<A, B>(tuple: [A, B]): [B, A] {
        return [tuple[1], tuple[0]];
    }
    let swapped = swap<string, number>(['a', 1]);
    console.log(swapped);
    console.log(swapped[0].toFixed(2));
    console.log(swapped[1].length);
}

/* ---------- 默认泛型类型 ---------- */
namespace g {
    function createArray3<T = number>(length: number, value: T): Array<T> {
        let result: T[] = [];
        for (let i = 0; i < length; i++) {
            result[i] = value;
        }
        return result;
    }
    let result2 = createArray3(3, 'x');
    console.log(result2);
}

/* ---------- 泛型约束 ---------- */
namespace h {
    function logger<T>(val: T) {
        // console.log(val.length); //直接访问会报错
    }
    //可以让泛型继承一个接口
    interface LengthWise {
        length: number
    }
    //可以让泛型继承一个接口
    function logger2<T extends LengthWise>(val: T) {
        console.log(val.length)
    }
    logger2('zhufeng');
    // logger2(1);
}

/* ---------- 泛型类型别名 ---------- */
namespace i {
    type Cart<T> = { list: T[] } | T[]; //type就表示类型别名
    let c1: Cart<string> = { list: ['1'] };
    let c2: Cart<number> = [1]
}

/* ---------- 泛型接口 vs 泛型类型别名 ---------- */
/**
 * 接口创建了一个新的名字，它可以在其它任意地方被调用。而类型别名并不创建新的名字，例如报错信息就不会使用别名
 * 类型别名不能被extends和implements，这时我们应该尽量使用接口代替类型别名
 * 当我们需要使用联合类型或者元组类型的时候，类型别名会更合适
 * 
 * 能用接口就不要用类型别名
 */

/* ---------- compose案例 ---------- */
type Func<T extends any[], R> = (...a: T) => R

export default function compose(): <R>(a: R) => R

export default function compose<F extends Function>(f: F): F

/* two functions */
export default function compose<A, T extends any[], R>(
    f1: (a: A) => R,
    f2: Func<T, A>
): Func<T, R>

/* three functions */
export default function compose<A, B, T extends any[], R>(
    f1: (b: B) => R,
    f2: (a: A) => B,
    f3: Func<T, A>
): Func<T, R>

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
    f1: (c: C) => R,
    f2: (b: B) => C,
    f3: (a: A) => B,
    f4: Func<T, A>
): Func<T, R>

/* rest */
export default function compose<R>(
    f1: (a: any) => R,
    ...funcs: Function[]
): (...args: any[]) => R

export default function compose<R>(...funcs: Function[]): (...args: any[]) => R

export default function compose(...funcs: Function[]) {
    if (funcs.length === 0) {
        // infer the argument type so it is usable in inference down the line
        return <T>(arg: T) => arg
    }

    if (funcs.length === 1) {
        return funcs[0]
    }

    return funcs.reduce((a, b) => (...args: any) => a(b(...args)))
}
//示例：
//零个函数中间件
let c1 = compose()<string>('zijue');
//一个函数中间件
interface F {
    (a: string): string
}
let f1: F = (a: string): string => a + 'f';
let c2 = compose<F>(f1)('zijue');
//两个函数中间件
type A = string;
type R = string;
type T = string[];
let f2 = (a: A): R => a + 'f2';
let f3 = (...a: T): A => a + 'f3';
let c3 = compose<A, T, R>(f2, f3)('zijue');