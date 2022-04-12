type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never
}
type XOR<T, U> = (T | U) extends object
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U

// A类型
type A = {
    name: string;
};
// B类型
type B = {
    title: string;
};

// A和B两种类型只有一个能出现
type AOrB = XOR<A, B>;

const AOrB1: AOrB = { name: "姓名" }; // 编译通过
const AOrB2: AOrB = { title: "标题" }; // 编译通过
// const AOrB3: AOrB = { title: "标题", name: "姓名" };
// const AOrB4: AOrB = { name: "姓名", otherKey: "" };