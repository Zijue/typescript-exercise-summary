export { };

/* ---------- 类型保护 ---------- */
//就是通过一些关键字(typeof instanceof in)来缩小范围，并判断出分支中的类型

/* ---------- typeof类型保护 ---------- */
namespace a {
    function double(input: string | number | boolean) {
        if (typeof input === 'string') {
            return input + input;
        } else {
            if (typeof input === 'number') {
                return input * 2;
            } else {
                return !input;
            }
        }
    }
}

/* ---------- instanceof类型保护 ---------- */
namespace b {
    class Animal {
        name!: string;
    }
    class Bird extends Animal {
        swing!: number;
    }
    function getName(animal: Animal) {
        if (animal instanceof Bird) {
            console.log(animal.swing);
        } else {
            console.log(animal.name);
        }
    }
}

/* ---------- null保护 ---------- */
//如果开启了strictNullChecks选项，那么对于可能为null的变量不能调用它上面的属性和方法
namespace c {
    function getFirstLetter(s: string | null) {
        //第一种方式是加上null判断
        if (s == null) {
            return '';
        }
        //第二种处理是增加一个或的处理
        s = s || '';
        return s.charAt(0);
    }
    //它并不能处理一些复杂的判断，需要加非空断言操作符
    function getFirstLetter2(s: string | null) {
        function log() {
            console.log(s!.trim());
        }
        s = s || '';
        log();
        return s.charAt(0);
    }
}

/* ---------- 链判断运算符 "?." ---------- */
// a?.b; //如果a是null/undefined,那么返回undefined，否则返回a.b的值.
// a == null ? undefined : a.b;

// a?.[x]; //如果a是null/undefined,那么返回undefined，否则返回a[x]的值
// a == null ? undefined : a[x];

// a?.b(); // 如果a是null/undefined,那么返回undefined
// a == null ? undefined : a.b(); //如果a.b不函数的话抛类型错误异常,否则计算a.b()的结果

// a?.(); //如果a是null/undefined,那么返回undefined
// a == null ? undefined : a(); //如果A不是函数会抛出类型错误


/* ---------- 可辨识的联合类型 ---------- */
//就是利用联合类型中的共有字段进行类型保护的一种技巧
//相同字段的不同取值就是可辨识
namespace d {
    interface WarningButton {
        class: 'warning',
        text1: '修改'
    }
    interface DangerButton {
        class: 'danger',
        text2: '删除'
    }
    type Button = WarningButton | DangerButton;
    function getButton(button: Button) {
        if (button.class == 'warning') {
            console.log(button.text1);
        }
        if (button.class == 'danger') {
            console.log(button.text2);
        }
    }

    interface User {
        username: string
    }
    type Action = {
        type: 'add',
        payload: User
    } | {
        type: 'delete'
        payload: number
    }
    const UserReducer = (action: Action) => {
        switch (action.type) {
            case "add":
                let user: User = action.payload;
                break;
            case "delete":
                let id: number = action.payload;
                break;
            default:
                break;
        }
    };
}

/* ---------- in操作符 ---------- */
namespace e {
    interface Bird {
        swing: number;
    }

    interface Dog {
        leg: number;
    }

    function getNumber(x: Bird | Dog) {
        if ("swing" in x) {
            return x.swing;
        }
        return x.leg;
    }
}

/* ---------- 自定义的类型保护 ---------- */
namespace f {
    // type is Type1Class 就是类型谓词
    // function isType1(type: Type1Class | Type2Class): type is Type1Class {
    //     return (<Type1Class>type).func1 !== undefined;
    // }

    interface Bird {
        swing: number;
    }

    interface Dog {
        leg: number;
    }

    //没有相同字段可以定义一个类型保护函数
    function isBird(x: Bird | Dog): x is Bird {
        return (<Bird>x).swing == 2;
        //return (x as Bird).swing == 2;
    }

    function getAnimal(x: Bird | Dog) {
        if (isBird(x)) {
            return x.swing;
        }
        return x.leg;
    }
}

/* ---------- unknown ---------- */
//unknown是any的安全类型
//any可以进行任何操作，而不需要检查类型
namespace g {
    //如果想要调用unknown上的属性或方法，就需要缩小unknown的类型范围
    //typeof instanceof 自定义保护类型 类型断言
    const value: unknown = "Hello World";
    const someString: string = value as string;

    //在联合类型中，unknown类型会吸收任何类型
    type UnionType1 = unknown | null;       // unknown
    type UnionType2 = unknown | undefined;  // unknown
    type UnionType3 = unknown | string;     // unknown
    type UnionType4 = unknown | number[];   // unknown

    //在交叉类型中，任何类型都可以吸收unknown类型
    type IntersectionType1 = unknown & null;       // null
    type IntersectionType2 = unknown & undefined;  // undefined
    type IntersectionType3 = unknown & string;     // string
    type IntersectionType4 = unknown & number[];   // number[]
    type IntersectionType5 = unknown & any;        // any

    //never是unknown的子类型
    type isNever = never extends unknown ? true : false;
    //keyof unknown等于never
    type key = keyof unknown;

    //只能对unknown进行等或不等操作，不能进行其它操作
    let un1!: unknown;
    let un2!: unknown;
    un1 === un2;
    un1 !== un2;
    // un1 += un2; //报错

    //不能做任何操作
    // - 不能访问属性 un.name
    // - 不能作为函数调用个 un();
    // - 不能当做类的构造函数，不能创建实例 new un();

    //映射属性
    //如果映射属性遍历的时候是unknown，不会映射属性
    type getType<T> = {
        [P in keyof T]: number
    }
    type t = getType<unknown>; // {}
}