/* ---------- 类型推导 ---------- */
/**
 * 定义时未赋值就会推论成any类型
 * 如果定义的时候就赋值，就能利用到类型推论
 */
let username1; //any
let str1 = 'zijue'; //string
// str1 = 0; //不能将number类型的值赋值给string

/* ---------- 包装对象（Wrapper Object） ---------- */
/**
 * JS的类型分为两种：原始数据类型 和 对象类型
 * 所有的原始数据类型都没有属性
 * 原始数据类型包含：布尔值、数值、字符串、null、undefined、Symbol
 * 
 * ※ 当调用基本数据类型方法的时候，JavaScript会在原始数据类型和对象类型之间做一个迅速的强制性切换
 */
let str2 = 'zijue';
console.log(str2.toUpperCase()); //本来str2是原始数据类型，不存在toUpperCase方法，但是JS会自动进行包装
//上面这段代码，JS自动处理成下面这样的形式
console.log((new String('zijue')).toUpperCase());
let isOk1: boolean = true; //编译通过，原始数据类型
let isOk2: boolean = Boolean(1); //编译通过
//new Boolean(1)，new出来的是一个对象类型，而isOk3期待的是一个原始数据类型，所以不兼容
// let isOk3: boolean = new Boolean(1); //编译失败

/* ---------- 联合类型 ---------- */
//Union Types表示取值可以为多种类型中的一种
//未赋值时，联合类型只能访问两个类型共有的属性和方法
let username2: string | number;
console.log(username2!.toString()); //只会提示string、number包装对象都有的方法
username2 = 3;
console.log(username2.toFixed(2));
username2 = 'zijue';
console.log(username2.length);

/* ---------- 类型断言 ---------- */
let username3: string | number;
console.log((username3! as number).toFixed(2));
console.log((username3! as string).length);
//双重断言
console.log(username3! as any as boolean); //本来string | number不能直接断言成boolean，通过双重断言就可以实现

/* ---------- 字面量类型和类型字面量 ---------- */
const up: 'Up' = 'Up';
const down: 'Down' = 'Down';
const left: 'Left' = 'Left';
const right: 'Right' = 'Right';
//可以实现枚举的效果
function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}
const Direction = strEnum(['Up', 'Down', 'Left', 'Right']);
type Direction = keyof typeof Direction; //type Direction = "Up" | "Down" | "Left" | "Right"
// 类型字面量
type Person = {
    name: string,
    age: number
}

/* ---------- 字符串字面量 vs 联合类型 ---------- */
/**
 * 字符串字面量：限定了使用该字面量的地方仅接受特定的值
 * 联合类型：对于值并没有限定，仅限制值的类型
 */