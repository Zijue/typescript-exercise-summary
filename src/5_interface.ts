export { };

/* ---------- 接口 ---------- */
//接口一方面可以在面向对象编程中表示为“行为的抽象”，另外可以用来描述“对象的形状”
//接口像插件一样用来增强类，而抽象类是具体类的抽象概念
//一个类可以实现多个接口，一个接口也可以被多个类实现；同样，一个类可以有多个子类，但只能有一个父类

/* ---------- 描述对象的形状 ---------- */
namespace a {
    //接口可以用来描述`对象的形状`,少属性或者多属性都会报错
    interface Speakable {
        speak(): void;
        name?: string;
    }
    let speakMan: Speakable = {
        speak() { }, //少属性会报错
        name: 'zijue',
        // age: 18 //多属性也会报错
    }
}

/* ---------- 表示行为的抽象 ---------- */
namespace b {
    //接口可以在面向对象编程中表示为行为的抽象
    interface Speakable {
        speak(): void;
    }
    interface Eatable {
        eat(): void
    }
    //一个类可以实现多个接口
    class Person implements Speakable, Eatable {
        speak() {
            console.log('Person说话');
        }
        eat() { }
    }
    class TangDuck implements Speakable {
        speak() {
            console.log('TangDuck说话');
        }
        eat() { }
    }
}

/* ---------- 任意属性与readonly ---------- */
namespace c {
    //无法预先知道有哪些新的属性的时候, 可以使用 `[propName:string]:any`, propName名字是任意的
    interface Person {
        readonly id: number;
        name: string;
        [propName: string]: any;
    }

    let p1: Person = {
        id: 1,
        name: 'zijue',
        age: 10
    }
    // p1.id = 2; //只读属性不能被修改
}

/* ---------- 接口的继承 ---------- */
namespace d {
    interface Speakable {
        speak(): void
    }
    interface SpeakChinese extends Speakable {
        speakChinese(): void
    }
    class Person implements SpeakChinese {
        speak() {
            console.log('Person')
        }
        speakChinese() {
            console.log('speakChinese')
        }
    }
}

/* ---------- 函数类型接口 ---------- */
namespace e {
    interface discount {
        (price: number): number
    }
    let cost: discount = function (price: number): number {
        return price * .8;
    }
}

/* ---------- 可索引接口 ---------- */
//对数组和对象进行约束；约束数组时index类型为number，约束对象时index类型为string
namespace f {
    interface UserInterface {
        [index: number]: string
    }
    let arr: UserInterface = ['zijue1', 'zijue2'];

    interface UserInterface2 {
        [index: string]: string
    }
    let obj: UserInterface2 = { name: 'zijue' };
}

/* ---------- 类接口 ---------- */
namespace g {
    interface Speakable {
        name: string;
        speak(words: string): void
    }
    class Dog implements Speakable {
        name!: string;
        speak(words: string) {
            console.log(words);
        }
    }
    let dog = new Dog();
    dog.speak('汪汪汪');
}

/* ---------- 构造函数类型 ---------- */
//在TS中，我们可以用interface来描述类，同时也可以使用interface里的特殊关键字new()来描述类的构造函数类型
namespace h {
    class Animal {
        constructor(public name: string) { }
    }
    //不加new是修饰函数的,加new是修饰类的
    interface WithNameClass {
        new(name: string): Animal
    }
    function createAnimal(clazz: WithNameClass, name: string) {
        return new clazz(name);
    }
    let a = createAnimal(Animal, 'zhufeng');
    console.log(a.name);
}

/* ---------- 抽象类 vs 接口 ---------- */
//不同类之间公有的属性或方法，可以抽象成一个接口（interface）
//而抽象类是供其他类继承的抽象类，不能实例化。抽象类中的抽象方法必须在子类中被实现
//抽象类本质是一个无法被实例化的类，其中能够实现方法和初始化属性，而接口仅能够用于描述，既不提供方法的实现，也不为属性进行初始化
//一个类可以继承一个类或抽象类，但可以实现多个接口
//抽象类也可以实现接口
namespace i {
    abstract class Animal {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        abstract speak(): void;
    }
    interface Flying {
        fly(): void
    }
    class Duck extends Animal implements Flying {
        speak() {
            console.log('汪汪汪');
        }
        fly() {
            console.log('我会飞');
        }
    }
    let duck = new Duck('zhufeng');
    duck.speak();
    duck.fly();
}