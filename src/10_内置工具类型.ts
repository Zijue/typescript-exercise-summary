/* ---------- 内置工具类型 ---------- */
// readonly 或 ? 修饰符在一个映射类型里，可以用前缀 + 或 - 来表示这个修饰符应该被添加或移除
// 例如：+? 表示变为可选；-? 表示变为必须

/* ---------- Partial ---------- */
namespace a {
    //可以将传入的属性由非可选变成可选
    type Partial<T> = {
        [P in keyof T]?: T[P]
    };
    interface A {
        a1: string;
        a2: number;
        a3: boolean;
    }
    type aPartial = Partial<A>;
    let a: aPartial = {};
}

/* ---------- 类型递归 ---------- */
namespace b {
    interface Company {
        id: number
        name: string
    }
    interface Person {
        id: number
        name: string
        company: Company
    }
    type DeepPartial<T> = {
        [U in keyof T]?: T[U] extends object
        ? DeepPartial<T[U]>
        : T[U]
    };
    type R2 = DeepPartial<Person>;
    let x: R2['company'] = {};
}

/* ---------- Required ---------- */
namespace c {
    //Required可以将传入的属性中的可选项变为必选项，用 -? 修饰符来实现
    interface Person {
        name: string;
        age: number;
        gender?: 'male' | 'female';
    }
    type Required<T> = { [P in keyof T]-?: T[P] };
    let p: Required<Person> = {
        name: 'zijue',
        age: 18,
        gender: 'male' //没有此项会报错
    }
}

/* ---------- Readonly ---------- */
namespace d {
    //readonly通过传入的属性每一项都加上readonly修饰符来实现
    interface Person {
        name: string;
        age: number;
        gender?: 'male' | 'female';
    }
    type Readonly<T> = { readonly [P in keyof T]: T[P] };
    let p: Readonly<Person> = {
        name: 'zijue',
        age: 18,
        gender: 'male'
    }
    // p.age = 11; //只读属性，赋值会报错
}

/* ---------- Pick ---------- */
namespace e {
    //Pick能够帮助我们从传入的属性中摘取某一项返回
    interface Animal {
        name: string;
        age: number;
        gender: string
    }
    type Pick<T, K extends keyof T> = {
        [P in K]: T[P];
    }
    function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
        const result = {} as Pick<T, K>;
        keys.map(key => {
            result[key] = obj[key];
        });
        return result;
    }
    let animal: Animal = { name: 'zijue', age: 18, gender: 'male' };
    let result: Pick<Animal, 'name' | 'age'> = pick<Animal, 'name' | 'age'>(animal, ['name', 'age']);
    console.log(result);
}

/* ---------- Record ---------- */
namespace f {
    //他会将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型
    type Record<K extends keyof any, T> = {
        [P in K]: T;
    };
    type Point = 'x' | 'y';
    type PointList = Record<Point, { value: number }>
    const cars: PointList = {
        x: { value: 10 },
        y: { value: 20 },
    }
}

/* ---------- 自定义高级类型 ---------- */
//utility-types

/* ---------- Proxy ---------- */
namespace g {
    type Proxy<T> = {
        get(): T;
        set(value: T): void;
    }
    type Proxify<T> = {
        [P in keyof T]: Proxy<T[P]>;
    }
    function proxify<T>(obj: T): Proxify<T> {
        const result = {} as Proxify<T>;
        for (const key in obj) {
            result[key] = {
                get: () => obj[key],
                set: (value) => obj[key] = value
            }
        }
        return result;
    }
    let props = {
        name: 'zijue',
        age: 18
    }
    let proxyProps = proxify(props);
    console.log(proxyProps.name);

    function unProxify<T>(t: Proxify<T>): T {
        let result = {} as T;
        for (const k in t) {
            result[k] = t[k].get();
        }
        return result;
    }
    let originProps = unProxify(proxyProps);
    console.log(originProps);
}

/* ---------- SetDifference ---------- */
//类似于Exclude
namespace h {
    type SetDifference<A, B> = A extends B ? never : A;
    type x = SetDifference<string | number | (() => void), Function>; //string | number
    type y = SetDifference<'1' | '2' | '3', '2' | '3' | '4'>; //'1'
}

/* ---------- Omit 与 SetDifference ---------- */
namespace i {
    type SetDifference<A, B> = A extends B ? never : A;

    //Omit<T, K>的作用是忽略T中的某些属性。Omit = Exclude + Pick
    type Omit<T, K extends keyof any> = Pick<T, SetDifference<keyof T, K>>;

    //Diff
    type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
}

/* ---------- Intersection ---------- */
namespace j {
    type Intersection<T extends object, U extends object> = Pick<
        T,
        Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
    >;
}

/* ---------- Overwrite ---------- */
//用U的属性覆盖T中相同的属性
namespace k {
    type SetDifference<A, B> = A extends B ? never : A;
    type Diff<T extends object, U extends object> = Pick<T, SetDifference<keyof T, keyof U>>;
    type Intersection<T extends object, U extends object> = Pick<T, Extract<keyof T, keyof U> & Extract<keyof U, keyof T>>;

    type Overwrite<
        T extends object,
        U extends object,
        I = Diff<T, U> & Intersection<U, T>
        > = Pick<I, keyof I>
    //示例
    type Props = { name: string; age: number; visible: boolean };
    type NewProps = { age: string; other: string };
    type ReplacedProps = Overwrite<Props, NewProps>;
}

/* ---------- Merge ---------- */
//Merge<O1, O2> = Compute + Omit<U, T>
namespace l {
    type O1 = {
        id: number;
        name: string;
    }
    type O2 = {
        id: number;
        age: number;
    }
    //Compute的作用是将交叉类型合并
    type Compute<A extends any> = A extends Function ? A : { [K in keyof A]: A[K] };
    // type int = Compute<O1 & O2>
    type Merge<O1 extends object, O2 extends object> = Compute<O1 & Omit<O2, keyof O1>>;
    type test = Merge<O1, O2>;
}

/* ---------- Mutable ---------- */
//将T的所有属性的readonly移除
namespace m {
    type Mutable<T> = {
        -readonly [P in keyof T]: T[P];
    }
    type test = Mutable<{
        readonly name: string;
        readonly age: number
    }>
}
