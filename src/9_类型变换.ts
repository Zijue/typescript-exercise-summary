export { };

/* ---------- 类型推断 ---------- */
namespace a {
    //TS能够根据一些简单的规则推断变量的类型

    /* ---------- 从右向左 ---------- */
    //变量的类型可以由定义推断
    //这是一个从右向左流动类型的示例
    let foo = 1; //foo是number
    let bar = 'zijue'; //bar是string
    // foo = bar; //不能将string赋值给number

    /* ---------- 底部流出 ---------- */
    //返回类型能被return语句推断
    function add(a: number, b: number) {
        return a + b;
    }
    let c = add(1, 2); //number

    /* ---------- 从左向右 ---------- */
    //函数参数类型、返回值类型也能通过赋值来推断
    type Sum = (a: number, b: number) => number;
    let sum: Sum = (a, b) => {
        // a = 'zijue'; //报错
        return a + b;
    }

    /* ---------- 结构化 ---------- */
    //推断规则也适用于结构化的存在(对象字面量)
    const person = {
        name: 'zijue',
        age: 18
    };
    let name1 = person.name; //string
    let age1 = person.age; //number
    // age = 'hello'; //报错

    /* ---------- 解构 ---------- */
    //推断规则也适用于解构
    let { name, age } = person; //string number
    // age = 'hello'; //报错
    let numbers = [1, 2, 3];
    // numbers[0] = 'hello'; //报错

    /* ---------- DefaultProps ---------- */
    interface DefaultProps {
        name?: string;
        age?: number;
    }
    let defaultProps: DefaultProps = {
        name: 'zijue',
        age: 18
    }
    let props = {
        ...defaultProps,
        home: 'wh'
    }
    type Props = typeof props;

    /* ---------- 小心使用返回值 ---------- */
    //尽管TS一般情况下能推断函数的返回值，但是它可能并不是你想要的
    function addOne(a: any) {
        return a + 1;
    }
    function sum1(a: number, b: number) {
        return a + addOne(b);
    }
    type Ret = ReturnType<typeof sum1>; //any
}

/* ---------- 交叉类型 ---------- */
//交叉类型(Intersection Types)是将多个类型合并为一个类型
//这让我们可以把现有的多种类型叠加到一起成为一种类型，它包含了所需的所有类型的特性
namespace b {
    //接口的交叉
    interface Bird {
        name: string,
        fly(): void
    }
    interface Person {
        name: string,
        talk(): void
    }
    type BirdPerson = Bird & Person;
    let p: BirdPerson = { name: 'zhufeng', fly() { }, talk() { } };
    p.fly;
    p.name
    p.talk;

    //联合类型的交叉类型
    type Ta = string | number;
    type Tb = number | boolean;
    type Tc = Ta & Tb; //number

    //mixin案例
    interface AnyObject {
        [prop: string]: any;
    }
    function mixin<T extends AnyObject, U extends AnyObject>(one: T, two: U): T & U {
        const result = <T & U>{};
        for (let key in one) {
            (<T>result)[key] = one[key];
        }
        for (let key in two) {
            (<U>result)[key] = two[key];
        }
        return result;
    }
    const x = mixin({ name: "zhufeng" }, { age: 11 });
    console.log(x.name, x.age);
}

/* ---------- typeof ---------- */
//可以获取一个变量的类型
namespace c {
    let p1 = {
        name: 'zijue',
        age: 18,
        gender: 'male'
    }
    type People = typeof p1;
    function getName(p: People): string {
        return p.name;
    }
    getName(p1);
}

/* ---------- 索引访问操作符 ---------- */
//可以通过“[]”获取一个类型的子类型
namespace d {
    interface Person {
        name: string;
        age: number;
        job: {
            name: string;
        };
        interests: {
            name: string,
            level: number
        }[]
    }
    let FrontEndJob: Person['job'] = {
        name: 'FrontEnd'
    }
    let interestLevel: Person['interests'][0]['level'] = 1;
}

/* ---------- keyof ---------- */
//索引类型查询操作符
namespace e {
    interface Person {
        name: string;
        age: number;
        gender: 'male' | 'female';
    }
    type PersonKey = keyof Person; //等价于type PersonKey = 'name' | 'age' | 'gender';
    function getValueByKey(p: Person, key: PersonKey) {
        return p[key];
    }
    let val = getValueByKey({ name: 'zijue', age: 18, gender: 'male' }, 'gender');
    console.log(val);
}

/* ---------- 映射类型 ---------- */
namespace f {
    //在定义的时候用“in”操作符去批量定义类型中的属性
    interface Person {
        name: string;
        age: number;
        gender: 'male' | 'female';
    }
    //批量把一个接口中的属性都变成可选的
    type PartPerson = {
        [key in keyof Person]?: Person[key];
    }
    let p1: PartPerson = {};
    //也可以使用泛型
    type Part<T> = {
        [key in keyof T]?: T[key];
    }
    let p2: Part<Person> = {};

    //通过key的数组获取值的数组
    function pick<T, K extends keyof T>(o: T, names: K[]): T[K][] {
        return names.map(n => o[n]);
    }
    let user = { id: 1, name: 'zijue' };
    type User = typeof user;
    const res = pick<User, keyof User>(user, ['id', 'name']);
    console.log(res);
}

/* ---------- 条件类型 ---------- */
//在定义泛型的时候能够添加进逻辑分支，以后泛型更加灵活
namespace g {
    /* ---------- 定义条件类型 ---------- */
    interface Fish {
        fish: string
    }
    interface Water {
        water: string
    }
    interface Bird {
        bird: string
    }
    interface Sky {
        sky: string
    }
    //若 T 能够赋值给 Fish，那么类型是 Water,否则为 Sky
    type Condition<T> = T extends Fish ? Water : Sky;
    let condition: Condition<Fish> = { water: '水' };

    /* ---------- 条件类型的分发 ---------- */
    //(Fish extends Fish ? Water : Sky) | (Bird extends Fish ? Water : Sky)
    // Water|Sky
    let condition1: Condition<Fish | Bird> = { water: '水' };
    let condition2: Condition<Fish | Bird> = { sky: '天空' };
    //有时候为了防止上述的分发情况，就需要使用元组的方式
    type Condition1<T> = [T] extends [Fish] ? Water : Sky;

    //找出T类型中U类型不包含的部分
    type Diff<T, U> = T extends U ? never : T; //never会被自动过滤
    type R = Diff<'a' | 'b' | 'c' | 'd', 'a' | 'c' | 'f'>; //'b'|'d'

    type Filter<T, U> = T extends U ? T : never;
    type R1 = Filter<string | number | boolean, number>;

    /* ---------- 内置条件类型 ---------- */
    //TS内置了一些常用的条件类型，可以在'lib.es5.d.ts'中查看
    //utility-types中封装了一些好用的类型

    //Exclude: 从T可分配的类型中排除U
    type Exclude<T, U> = T extends U ? never : T;
    type E = Exclude<string | number, string>; //number

    //Extract: 从T可分配的类型中提取U
    type Extract<T, U> = T extends U ? T : never;
    type E1 = Extract<string | number, string>; //string

    //NonNullable: 从T中排除null和undefined
    type NonNullable<T> = T extends null | undefined ? never : T;
    type E2 = NonNullable<string | number | null | undefined>; //string | number

    //ReturnType: 获取函数类型的返回类型
    //infer表示在extends条件语句中待推断的类型变量
    type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : any;
    function getUserInfo() {
        return { name: 'zijue', age: 18 };
    }
    type UserInfo = ReturnType<typeof getUserInfo>; //{name:string; age:number}

    //Parameters: 获取函数类型参数类型，组成元组进行返回
    type Parameters<T> = T extends (...args: infer R) => any ? R : any;
    type T0 = Parameters<() => string>; //[]
    type T1 = Parameters<(s: string) => void>;  //[string]
    type T2 = Parameters<(<T>(arg: T) => T)>;  //[unknown]

    //instanceType: 获取构造函数类型的实例类型
    type Constructor = new (...args: any[]) => any;
    type ConstructorParameters<T extends Constructor> = T extends new (...args: infer P) => any ? P : never;
    type InstanceType<T extends Constructor> = T extends new (...args: any[]) => infer R ? R : any;
    //示例
    class Person {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        getName() {
            console.log(this.name);
        }

    }
    let params: ConstructorParameters<typeof Person> = ['zijue']
    let p1: InstanceType<typeof Person> = { name: 'zijue', getName() { } }

    //infer + 分布式
    //tuple转联合类型
    type ElementOf<T> = T extends Array<infer E> ? E : never;
    type TupleToUnion = ElementOf<[string, number]>; // string | number
    //tuple转交叉类型
    type T3 = { name: string };
    type T4 = { age: number };
    type UnionToIntersection<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void } ? U : never;
    type T5 = UnionToIntersection<{ a: (x: T3) => void; b: (x: T4) => void }>; // T3 & T4
}
