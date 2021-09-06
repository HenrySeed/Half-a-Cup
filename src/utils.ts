export function toID(val: string) {
    return val
        .trim()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/_/g, "-")
        .replace(/[^A-z-]|\^/g, "")
        .replace(/[^A-z-]/g, "");
}

export function fromID(val: string) {
    return val
        .replace(/-/g, " ")
        .replace(/(?:^| )([a-z])/g, (match) => `${match}`.toUpperCase());
}

export function getRandFromArray<T>(arr: Array<T>): T {
    return arr[Math.floor(Math.random() * arr.length)];
}
