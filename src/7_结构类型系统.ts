export { };

/* ---------- 接口的兼容性 ---------- */
//如果传入的变量和声明的类型不匹配，TS就会进行兼容性检查
//原理是 Duck-Check，就是说只要目标类型中声明的属性变量在源类型中都存在就是兼容的
namespace a {
    interface Animal {
        name: string;
        age: number;
    }
    interface Person {
        name: string;
        age: number;
        gender: number;
    }
    //要判断目标类型Person是否能够兼容输入的源类型Animal
    function getName(animal: Animal): string {
        return animal.name;
    }
    let p = {
        name: 'zijue',
        age: 18,
        gender: 1
    }
    getName(p);
    //只有在传参的时候两个变量之间才会进行兼容性的比较，赋值的时候并不会比较，会直接报错
    let a1: Animal = {
        name: 'zijue',
        age: 18,
        // gender: 0 //直接报错
    }
}

/* ---------- 基本类型的兼容性 ---------- */
namespace b {
    let num: string | number;
    let str: string = 'zijue';
    num = str;
    //只要有toString()方法就可以赋给字符串变量
    let num2: {
        toString(): string
    }
    let str2: string = 'zijue';
    num2 = str2
}

/* ---------- 类的兼容性 ---------- */
//在TS中是结构类型系统，只会对比结构而不在意类型
namespace c {
    class Animal {
        name!: string
    }
    class Bird extends Animal {
        swing!: number
    }
    let a: Animal, b: Bird;
    a = new Bird();
    // b = new Animal();
}

/* ※ ---------- 函数的兼容性 ---------- */
namespace d {
    /* ---------- 比较参数 ---------- */
    //参数只能少不能多
    type sumFunc = (a: number, b: number) => number;
    let sum: sumFunc;
    function f1(a: number, b: number): number {
        return a + b;
    }
    sum = f1;
    //可以省略一个参数
    function f2(a: number): number {
        return a;
    }
    sum = f2;
    //可以省略两个参数
    function f3(): number {
        return 0;
    }
    sum = f3;

    //但是多一个参数就不行
    function f4(a: number, b: number, c: number) {
        return a + b + c;
    }
    // sum = f4; 

    /* ---------- 比较返回值 ---------- */
    //返回值只能多不能少
    type GetPerson = () => { name: string, age: number };
    let getPerson: GetPerson;
    function g1() {
        return { name: 'zijue', age: 18 };
    }
    getPerson = g1;
    //返回值多一个属性也可以
    function g2() {
        return { name: 'zijue', age: 18, gender: 'male' };
    }
    getPerson = g2;
    //返回值少一个属性不行 ~
    function g3() {
        return { name: 'zijue' };
    }
    // getPerson = g3; //报错
    //原因是：有可能要调用返回值上的方法，比如：
    getPerson().age.toFixed(2);
}

/* ※ ---------- 函数的协变与逆变 ---------- */
/**
 * 协变：只在同一个方向
 * 逆变：只在相反的方向
 * 双向协变：包括同一个方向和不同方向（为了防止双向协变，所以需要开启strict模式）
 * 不变：如果类型不完全相同，则它们是不兼容的
 * 
 * 返回值类型是协变的，而参数类型是逆变的
 *  返回值类型可以传子类，参数可以传父类
 *  参数逆变父类，返回值协变子类
 */
namespace e {
    class Animal { };
    class Dog extends Animal {
        public name: string = 'Dog';
    }
    class BlackDog extends Dog {
        public age: number = 10;
    }
    class WhiteDog extends Dog {
        public home: string = 'wh';
    }
    let animal: Animal = new Animal();
    let blackDog: BlackDog = new BlackDog();
    let whiteDog: WhiteDog = new WhiteDog();
    type Callback = (dog: Dog) => Dog;
    function exec(callback: Callback): void { };
    /** 四种情况
     * 1.参数传子类，返回值是子类 n
     * 2.参数传子类，返回值是父类 n
     * 3.参数传父类，返回值是父类 n
     * 4.参数传父类，返回值是子类 y
     */
    type ChildToChild = (blackDog: BlackDog) => BlackDog;
    let childToChild: ChildToChild = (blackDog: BlackDog): BlackDog => blackDog;
    // exec(childToChild); //报错
    type ChildToParent = (blackDog: BlackDog) => Animal;
    let childToParent: ChildToParent = (blackDog: BlackDog): Animal => animal;
    // exec(childToParent); //报错
    type ParentToParent = (animal: Animal) => Animal;
    let parentToParent: ParentToParent = (animal: Animal): Animal => animal;
    // exec(parentToParent); //报错
    type ParentToChild = (animal: Animal) => BlackDog;
    let parentToChild: ParentToChild = (animal: Animal): BlackDog => blackDog;
    exec(parentToChild);
}

/* ---------- 泛型的兼容性 ---------- */
//泛型在判断兼容性的时候会先判断具体的类型，然后再进行兼容性判断
namespace f {
    //接口类容为空，没用到泛型的时候是可以兼容的
    interface Empty<T> { };
    let x!: Empty<string>;
    let y!: Empty<number>;
    x = y;

    //接口内容不为空的时候就不兼容
    interface NotEmpty<T> {
        data: T;
    }
    let x1!: NotEmpty<string>;
    let y1!: NotEmpty<number>;
    // x1 = y1; //报错
}

/* ---------- 枚举的兼容性 ---------- */
//枚举类型与数字类型兼容，并且数字类型与枚举类型兼容
//不同枚举类型之间是不兼容的
namespace g {
    //数字可以赋给枚举
    enum Colors { Red, Yellow }
    let c: Colors;
    c = Colors.Red;
    c = 1;
    // c = '1';

    //枚举值可以赋给数字
    let n: number;
    n = 1;
    n = Colors.Red;
}
