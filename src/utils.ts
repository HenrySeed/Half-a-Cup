import { ingrModifiers, units } from "./modules";

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

/**
 * The ingredient string has a number, then a unit, then an ingredient name, this returns the ingredient name
 * @export
 * @param {string} val
 */
export function getIngredientName(val: string) {
    let trimmed = val.split(/,|\./g)[0];

    // remove anything in brackets
    trimmed = trimmed.replace(/\([^)]*\)/g, "");

    // replace double spaces
    trimmed = trimmed.replace(/ {2}/g, " ");

    let words = trimmed.split(" ");

    // remove leading numbers
    while (/^((\d+\/\d+[A-z]*)|(\d+[A-z]*)|a|one)$/g.test(words[0])) {
        words.splice(0, 1);
    }

    // if word is unit, remove it
    const allUnitNames = units.map((unit) => unit.alias).flat();
    words = words.filter((word) => !allUnitNames.includes(word));

    // if word is modifier, remove it
    words = words.filter((word) => !ingrModifiers.includes(word));

    return words.join(" ");
}
