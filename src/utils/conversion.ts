// 深拷贝
export const deepClone = <T>(object: T, hash = new WeakMap()): T => {
    if (object instanceof Date) return new Date((object as Date).getTime()) as unknown as T;
    if (object instanceof RegExp) return new RegExp(object) as unknown as T;
    if (typeof object !== "object" || object === null) return object;
    if (hash.has(object)) return hash.get(object);
    let cloneObj: any;
    if (Array.isArray(object)) cloneObj = [];
    else if (object instanceof Map) cloneObj = new Map();
    else if (object instanceof Set) cloneObj = new Set();
    else cloneObj = {};
    hash.set(object, cloneObj);
    for (const key in object) {
        if (object.hasOwnProperty(key)) {
            if (object instanceof Map) cloneObj.set(key, deepClone(object.get(key), hash));
            else if (object instanceof Set) cloneObj.add(deepClone(key, hash));
            else cloneObj[key] = deepClone(object[key], hash);
        }
    }
    return cloneObj as T;
};
// 补零
export const zeroAdd = (n: string | number) => {
    return Number(n) < 10 ? "0" + n : n.toString();
};