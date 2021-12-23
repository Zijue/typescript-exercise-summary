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
