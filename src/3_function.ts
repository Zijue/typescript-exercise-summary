/* ---------- 函数的定义 ---------- */
function hello1(name: string): void {
    console.log('hello', name);
}
hello1('zijue');

/* ---------- 函数表达式 ---------- */
type GetUsernameFunction = (x: string, y: string) => string;
let getUsername: GetUsernameFunction = function (firstName, lastName) {
    return firstName + lastName;
}

/* ---------- 没有返回值 ---------- */
let hello2 = function (name: string): void {
    console.log('hello', name);
    return undefined;
}
hello2('zijue');

/* ---------- 可选参数 ---------- */
//可选参数必须是最后一个参数
function myPrint(name: string, age?: number): void {
    console.log(name, age);
}
myPrint('xiaochi');

/* ---------- 默认参数 ---------- */
function ajax(url: string, method: string = 'GET') {
    console.log(url, method);
}
ajax('/users');

/* ---------- 剩余参数 ---------- */
function sum(...numbers: number[]) {
    return numbers.reduce((val, item) => val += item, 0);
}
console.log(sum(1, 2, 3));

/* ---------- 函数重载 ---------- */
//给同一个函数提供多个函数类型定义
let obj: any = {};
function attr(val: string): void; //函数声明
function attr(val: number): void; //函数声明
function attr(val: any): void { //函数实现，必须跟声明相连
    if (typeof val === 'string') {
        obj.name = val;
    } else {
        obj.age = val;
    }
}
attr('zfpx');
attr(9);
// attr(true); //类型不满足
console.log(obj);
//再看一个例子，体会函数重载的适用性
function add(x: string, y: string): string;
function add(x: number, y: number): number;
function add(x: any, y: any) { //利用函数重载实现，要么参数都为number，要么都是string
    return x + y;
}
// add(1, '1'); //报错