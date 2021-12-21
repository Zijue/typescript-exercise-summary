/* ---------- 基本数据类型 ---------- */

/* ---------- 布尔类型 boolean ---------- */
let married: boolean = false;

/* ---------- 数字类型 number ---------- */
let age: number = 10;

/* ---------- 字符串类型 string ---------- */
let firstname: string = 'zijue';

/* ---------- 数组类型 array ---------- */
let arr1: number[] = [4, 5, 6];
let arr2: Array<number> = [7, 8, 9];

/* ---------- 元组类型 tuple ---------- */
let arr3: [string, number] = ['zijue', 18]
console.log(arr3[0].length); //使用字符串类型的方法
console.log(arr3[1].toFixed(2)); //使用数字类型的方法

/* ---------- 数组与元组的对比 ---------- */
/**
 * 元组                         数组
 * 每一项可以是不同的类型        每一项都是同一种类型
 * 有预定义的长度               没有长度限制
 * 用于表示一个固定的结构        用于表示一个列表
 */

/* ---------- 枚举类型 enum ---------- */
//普通枚举
enum Gender {
    GIRL,
    BOY
}
console.log(Gender.BOY);
console.log(Gender.GIRL);
//常量枚举
const enum Colors {
    Red,
    Yellow,
    Blue
}
console.log([Colors.Red, Colors.Yellow, Colors.Blue]);

/* ---------- 普通枚举与常量枚举 ---------- */
/* 通过下面这段代码编译结果可以看出，常量枚举会在编译阶段被删除；
 * 并且不能包含计算成员，否则在编译阶段报错。(const enum Color {Red, Yellow, Blue = "blue".length};)会报错
var Gender;
(function (Gender) {
    Gender[Gender["GIRL"] = 0] = "GIRL";
    Gender[Gender["BOY"] = 1] = "BOY";
})(Gender || (Gender = {}));
console.log(Gender.BOY);
console.log(Gender.GIRL);
console.log([0, 1, 2]);
 */

/* ---------- 任意类型 any ---------- */
/**
 * any 可以赋值给任意类型，以下情况时比较适用
 * 1.第三方库没有提供类型文件时可以使用any
 * 2.类型转换遇到困难时
 * 3.数据结构太复杂难以定义
 */

/* ---------- null 和 undefined ---------- */
/**
 * null 和 undefined 是其它类型的子类型，可以赋值给其它类型，此时赋值后的类型会变成 null 或 undefined
 * 但是在严格模式下，null 和 undefined 都不属于任何一个类型，它们只能赋值给自己这种类型或者 any
 */

/* ---------- void 类型 ---------- */
/**
 * void 表示没有任何类型
 * 当一个函数没有返回值时，TS 会认为它的返回值是 void 类型
 */
function sayHello(name: string): void {
    console.log('hello', name);
    //在非严格模式(strictNullChecks:false)下，可以返回 null 或 undefined 给 void
    //在严格模式(strictNullChecks:false)下，只能返回 undefined
    //return null; ×
    //return undefined; √
}

/* ---------- never 类型 ---------- */
//never 是其它类型（包括 null undefined）的子类型，表示不会出现的值
//作为不会返回的函数的返回值类型，通过下面例子来理解：
function myError(message: string): never {
    throw new Error(message); //抛出异常
}
// let result1 = myError('test'); //never
function infiniteLoop(): never {
    while (true) { }; //死循环，无法终止
}
function fn(x: number | string) {
    if (typeof x === 'number') {
        // x: number 类型
    } else if (typeof x === 'string') {
        // x: string 类型
    } else {
        // x: never 类型
        // --strictNullChecks 模式下，这里的代码将不会被执行，x 无法被观察
    }
}

/* ---------- never 和 void 的区别 ---------- */
//void 可以被赋值为 null 和 undefined 的类型。never 则是一个不包含值的类型；
//拥有 void 返回值类型的函数能正常运行。拥有 never 返回值类型的函数无法正常返回（无法终止或者抛出异常）

/* ---------- Symbol ---------- */
//Symbol的值是唯一不变的
const sym1 = Symbol('key');
const sym2 = Symbol('key');
console.log(Symbol('key') === Symbol('key')); //false

/* ---------- BigInt ---------- */
// const max = Number.MAX_SAFE_INTEGER; //2**53 - 1
const max = BigInt(Number.MAX_SAFE_INTEGER);
console.log(max + BigInt(1) === max + BigInt(2)); //false，突破了js最大值限制
// console.log(max + 1n === max + 2n); //使用`1n`需要设置{"target": "ESNext"}
// number 和 bigint 类型不兼容
let foo: number = 0, bar: bigint = BigInt(0);
// foo = bar;
// bar = foo;