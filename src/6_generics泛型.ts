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