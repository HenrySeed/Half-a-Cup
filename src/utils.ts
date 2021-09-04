export function toID(val: string) {
    return val
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^A-z-]|\^/g, "");
}

export function getRandFromArray<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
