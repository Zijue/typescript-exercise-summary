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