export { }; //表示此文件是一个模块

/* ---------- 类的定义 ---------- */
class Person1 {
    name: string = 'zijue';
    getName(): void {
        console.log(this.name);
    }
}
let p1 = new Person1();
p1.name = 'xiaochi';
p1.getName();

/* ---------- 定义存取器 ---------- */
class User {
    myName: string;
    constructor(myName: string) {
        this.myName = myName;
    }
    get name() {
        return this.myName;
    }
    set name(value) {
        this.myName = value;
    }
}
let user = new User('zijue');
user.name = 'xiaochi';
console.log(user.name);

/* ---------- 参数属性 ---------- */
//上面的写法可以改成下述的写法
class User1 {
    constructor(public myName: string) {
        this.myName = myName
    }
    get name() {
        return this.myName;
    }
    set name(value) {
        this.myName = value;
    }
}

/* ---------- readonly ---------- */
//readonly修饰的变量只能在“构造函数”中初始化
//readonly实际上只是在“编译”阶段进行代码检查；而const则会在“运行时”检查
class Animal {
    public readonly name: string
    constructor(name: string) {
        this.name = name;
    }
    changeName(name: string) {
        // this.name = name; //无法修改，报错提示
    }
}
let a = new Animal('zhufeng');
a.changeName('jiagou');

/* ---------- 继承 ---------- */
class Person2 {
    name: string; //定义实例的属性，默认省略public修饰符
    age: number;
    constructor(name: string, age: number) { //构造函数
        this.name = name;
        this.age = age;
    }
    getName(): string {
        return this.name;
    }
    setName(name: string): void {
        this.name = name;
    }
}
class Student extends Person2 {
    no: number;
    constructor(name: string, age: number, no: number) {
        super(name, age);
        this.no = no;
    }
    getNo(): number {
        return this.no;
    }
}
let s1 = new Student('zijue', 18, 1);
console.log(s1);

/* ---------- 类里面的修饰符 ---------- */
class Father {
    public name: string; //类里面 子类 其它任何地方外边都可以访问
    protected age: number; //类里面 子类 都可以访问,其它任何地方不能访问
    private money: number; //类里面可以访问，子类和其它任何地方都不可以访问
    constructor(name: string, age: number, money: number) { //构造函数
        this.name = name;
        this.age = age;
        this.money = money;
    }
    getName(): string {
        return this.name;
    }
    setName(name: string): void {
        this.name = name;
    }
}
class Child extends Father {
    constructor(name: string, age: number, money: number) {
        super(name, age, money);
    }
    desc() {
        console.log(`${this.name} ${this.age}`);
        // console.log(`${this.name} ${this.age} ${this.money}`); //无法访问private修饰的父类属性
    }
}
let child = new Child('zfpx', 10, 1000);
console.log(child.name);
// console.log(child.age);
// console.log(child.money);
