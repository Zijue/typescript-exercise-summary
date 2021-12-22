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
let animal = new Animal('zijue');
animal.changeName('xiaochi');

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

/* ---------- 静态属性 静态方法 ---------- */
class Father2 {
    static className = 'Father';
    static getClassName() {
        return Father2.className;
    }
    constructor(public name: string) {
        this.name = name;
    }
}
console.log(Father2.className);
console.log(Father2.getClassName());

/* ---------- 装饰器 ---------- */
/**
class Person3 {
    say() {
        console.log('hello')
    }
}

//上述代码最终会被编译成如下代码

function Person3() { }
Object.defineProperty(Person3.prototype, 'say', {
    value: function () { console.log('hello'); },
    enumerable: false,
    configurable: true,
    writable: true
});
 */

/* ---------- 类装饰器 ---------- */
namespace a { //命名空间用于分隔作用域，可以使不同命名空间中定义相同的变量
    //当装饰器作为修饰类的时候，会把构造器传递进去
    function addNameEat(constructor: Function) {
        constructor.prototype.name = 'zijue';
        constructor.prototype.eat = function () {
            console.log('eat');
        }
    }
    @addNameEat
    class Person {
        name!: string;
        eat!: Function;
        constructor() { }
    }
    let p: Person = new Person();
    console.log(p.name);
    p.eat();
}
namespace b {
    //还可以使用装饰器工厂，即带参数的装饰器
    function addNameEatFactory(name: string) {
        return function (constructor: Function) {
            constructor.prototype.name = name;
            constructor.prototype.eat = function () {
                console.log('eat');
            }
        }
    }
    @addNameEatFactory('zijue')
    class Person {
        name!: string;
        eat!: Function;
        constructor() { }
    }
    let p: Person = new Person();
    console.log(p.name);
    p.eat();
}
namespace c {
    //还可以替换类，不过替换的类要与原类结构相同；属性可以多，但不能少
    function enhancer(constructor: Function) {
        return class {
            name: string = "zijue";
            age: number = 18; //可以比替换的类属性多
            eat() {
                console.log("eat");
            }
        };
    }
    @enhancer
    class Person {
        name!: string;
        eat!: Function;
        constructor() { }
    }
    let p: Person = new Person();
    console.log(p.name);
    p.eat();
}

/* ---------- 属性装饰器 ---------- */
/**
 * 属性装饰器用来装饰属性
 *  第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
 *  第二个参数是属性名称
 * 
 * 方法装饰器用来装饰方法
 *  第一个参数对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
 *  第二个参数是方法的名称
 *  第三个参数是方法描述器
 */
namespace d {
    //修饰实例属性 -- target: 类的原型对象
    function upperCase(target: any, propertyKey: string) {
        let value = target[propertyKey];
        const getter = function () {
            return value;
        }
        const setter = function (newVal: string) {
            value = newVal.toUpperCase();
        }
        //属性替换，先删除原先的属性，再重新定义属性
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: getter,
                set: setter,
                enumerable: true,
                configurable: true
            })
        }
    }
    //修饰静态属性(类属性) -- target: 类的构造函数
    function doubleAge(target: any, propertyKey: string) {
        let value = target[propertyKey];
        const getter = function () {
            return value * 2;
        }
        //属性替换，先删除原先的属性，再重新定义属性
        if (delete target[propertyKey]) {
            Object.defineProperty(target, propertyKey, {
                get: getter,
                enumerable: true,
                configurable: true
            })
        }
    }
    //修饰实例方法
    function noEnumerable(target: any, property: string, descriptor: PropertyDescriptor) {
        console.log('target.getName', target.getName);
        console.log('target.getAge', target.getAge);
        descriptor.enumerable = true;
    }
    //重写方法
    function toNumber(target: any, methodName: string, descriptor: PropertyDescriptor) {
        let oldMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            args = args.map(item => parseFloat(item));
            return oldMethod.apply(this, args);
        }
    }
    class Person {
        @upperCase
        name: string = 'zijue';
        @doubleAge
        public static age: number = 18;
        constructor() { }
        @noEnumerable
        getName() {
            console.log(this.name);
        }
        @toNumber
        sum(...args: any[]) {
            return args.reduce((accu: number, item: number) => accu + item, 0);
        }
    }
    //测试
    let p: Person = new Person();
    for (let attr in p) {
        console.log('attr=', attr);
    }
    p.name = 'xiaochi';
    p.getName();
    console.log(p.sum("1", "2", "3"));
}

/* ---------- 参数装饰器 ---------- */
//会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元数据
//  第一个参数，对于静态方法是类的构造函数，对于实例方法是类的原型对象
//  第二个参数是方法的名称
//  第三个参数是方法在函数列表中的索引
namespace e {
    function addAge(target: any, methodName: string, paramsIndex: number) {
        console.log(target);
        console.log(methodName);
        console.log(paramsIndex);
        target.age = 10;
    }
    class Person {
        age!: number;
        login(username: string, @addAge password: string) {
            console.log(this.age, username, password);
        }
    }
    let p = new Person();
    p.login('zijue', '123456')
}

/* ---------- 装饰器的执行顺序 ---------- */
/**
 * 多个参数装饰器执行顺序：从最后一个参数依次向前执行
 * 参数装饰器优先于方法装饰器执行：参数装饰器 >> 方法装饰器
 * 方法装饰器与属性装饰器：谁在前面谁先执行
 * 类装饰器总是最后执行
 * 
 * 针对多个装饰器的组合：求值外层装饰器 -> 求值内层装饰器 -> 调用内层装饰器 -> 调用外层装饰器
 * 
 * 装饰器的执行顺序总的来说就是遵循：先上后下，先内后外
 */
namespace e {
    function Class1Decorator() {
        console.log("evaluate 类1装饰器");
        return function (target: any) {
            console.log("call 类1装饰器");
        }
    }
    function Class2Decorator() {
        console.log("evaluate 类2装饰器");
        return function (target: any) {
            console.log("call 类2装饰器");
        }
    }
    function MethodDecorator() {
        return function (target: any, methodName: string, descriptor: PropertyDescriptor) {
            console.log("方法装饰器");
        }
    }
    function Param1Decorator() {
        return function (target: any, methodName: string, paramIndex: number) {
            console.log("参数1装饰器");
        }
    }
    function Param2Decorator() {
        return function (target: any, methodName: string, paramIndex: number) {
            console.log("参数2装饰器");
        }
    }
    function PropertyDecorator(name: string) {
        return function (target: any, propertyName: string) {
            console.log(name + "属性装饰器");
        }
    }

    @Class1Decorator()
    @Class2Decorator()
    class Person {
        @PropertyDecorator('name')
        name: string = 'zijue';
        @PropertyDecorator('age')
        age: number = 10;
        @MethodDecorator()
        greet(@Param1Decorator() p1: string, @Param2Decorator() p2: string) { }
    }
}
/** 上述装饰器的执行顺序
name属性装饰器
age属性装饰器
参数2装饰器
参数1装饰器
方法装饰器
evaluate 类1装饰器
evaluate 类2装饰器
call 类2装饰器
call 类1装饰器
 */

/* ---------- 抽象类与抽象方法 ---------- */
//抽象类无法被实例化，只能被继承
//抽象方法不能在抽象类中实现，只能在抽象类的具体子类中实现，而且必须实现
namespace f {
    abstract class Animal {
        name!: string;
        abstract speak(): void;
    }
    class Cat extends Animal {
        speak(): void {
            console.log('喵喵喵');
        }
    }
    let cat = new Cat();
    cat.speak();
}

/* ---------- 重写(override) vs 重载(overload) ---------- */
//重写：是指子类重写继承自父类中的方法
//重载：是指为同一个函数提供多个类型定义
namespace g {
    class Animal {
        speak(word: string): string {
            return '动作叫:' + word;
        }
    }
    class Cat extends Animal {
        speak(word: string): string {
            return '猫叫:' + word;
        }
    }
    let cat = new Cat();
    console.log(cat.speak('hello'));
    //--------------------------------------------
    function double(val: number): number
    function double(val: string): string
    function double(val: any): any {
        if (typeof val == 'number') {
            return val * 2;
        }
        return val + val;
    }
    let r = double(1);
    console.log(r);
}

/* ---------- 继承 vs 多态 ---------- */
//继承：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
//多态：由继承而产生了相关的不同的类，对同一个方法可以有不同的行为
namespace h {
    class Animal {
        speak(word: string): string {
            return 'Animal: ' + word;
        }
    }
    class Cat extends Animal {
        speak(word: string): string {
            return 'Cat:' + word;
        }
    }
    class Dog extends Animal {
        speak(word: string): string {
            return 'Dog:' + word;
        }
    }
    let cat = new Cat();
    console.log(cat.speak('hello'));
    let dog = new Dog();
    console.log(dog.speak('hello'));
}