import * as pluralize from "pluralize";

export interface ingredient {
    num: number | undefined;
    measurement: string | undefined;
    name: string;
    originalText: string;
}

const unitsList: string[][] = [
    ["c", "cup", "cups"],
    ["tsp", "tsps", "teaspoon", "teaspoons"],
    ["tbsp", "tbsps", "tablespoon", "tablespoons"],
    ["lb", "lbs", "pound", "pounds"],
    ["oz", "ounce", "ounces"],
    ["pint", "pints"],
    ["kg", "kilogram", "kilograms"],
    ["g", "gram", "grams"],
    ["mg", "miligram", "miligrams"],
    ["ml", "mililitre", "mililitres"],
    ["l", "litre", "litres"]
];

const units: string[] = [].concat.apply([], unitsList);

const packets: string[] = [
    "packet",
    "packets",
    "box",
    "boxes",
    "packages",
    "package",
    "tin",
    "tins",
    "dash",
    "pinch",
    "rasher",
    "rashers",
    "head",
    "can",
    "cans",
    "packs",
    "blocks",
    "pack",
    "block"
];
const qualifiers: string[] = [
    "big",
    "large",
    "rounded",
    "small",
    "medium",
    "approximately",
    "heaped",
    "fresh",
    "packed",
    "lightly",
    "optional"
];
const instructions: string[] = [
    "finely",
    "chopped",
    "minced",
    "peeled",
    "coarsely",
    "very",
    "soft",
    "cooked",
    "drained",
    "diced",
    "unbaked",
    "prepared",
    "cored",
    "thinly",
    "sliced",
    "grated",
    "cut",
    "into",
    "and",
    "skinned",
    "crushed",
    "halved",
    "hulled",
    "but",
    "pliable",
    "cold",
    "cm",
    "cubes",
    "frozen",
    "shredded",
    "toasted",
    "a"
];

const fillerWords = [
    "the",
    "of",
    "and",
    "this",
    "that",
    "there",
    "when",
    "where",
    "what",
    "a",
    "or",
    "such",
    "as",
    "baking"
];

const trimWords = qualifiers.concat(packets, instructions, ["of"]);

/**
 * Takes an ingredient string and removes common words from the front or the back
 * @param {string} name
 * @returns {{measurement: string, name: string}}
 */
function prune_string(
    name: string
): { measurement: string | undefined; name: string } {
    let measurement = undefined;
    const charsToReplace = [
        ",",
        ".",
        "[",
        "]",
        "{",
        "}",
        "(",
        ")",
        "_",
        "=",
        "+",
        "*",
        "&",
        "^",
        "%",
        "$",
        "#",
        "@",
        "!",
        "~",
        "`",
        ";",
        ":",
        "<",
        ">",
        "?",
        "\\",
        "|"
    ];

    // Remove anything after a comma
    name = name.split(",")[0];

    // check name for qualifiers and strip it
    if (trimWords.concat(["or"]).indexOf(name.split(" ")[0]) > -1) {
        name = name
            .split(" ")
            .slice(1)
            .join(" ");
        // check name for measurement and strip it
    } else if (units.indexOf(name.split(" ")[0]) > -1) {
        measurement = name.split(" ")[0];
        name = name
            .split(" ")
            .slice(1)
            .join(" ");
    }

    // Globally remove any words on the trimWords list
    const tempName: string[] = [];
    for (const word of name.trim().split(" ")) {
        let trimword = word.trim();
        if (
            trimWords.indexOf(trimword) < 0 &&
            !(word[0] == "(" && word[-1] == ")")
        ) {
            tempName.push(word);
        }
    }

    name = tempName.join(" ");

    // Remove any non approved chars, like +, -, ;, :, _
    for (const char of charsToReplace) {
        const r = new RegExp(`\${char}`, "g");
        name = name.replace(r, "");
    }

    name = pluralize.singular(name);

    return { measurement: measurement, name: name };
}

/**
 * Splits the ingredient line string into a quantity and the ingredient name
 * @param {string} str
 * @returns {(ingredient)}
 */
export function split_num_ingredient(str: string): ingredient {
    const og = str;
    let quantifier: string;
    let name: string = str.toLowerCase();
    let num: number | undefined = undefined;
    let measurement: string | undefined = undefined;

    // check name for qualifiers and strip it
    if (qualifiers.indexOf(str.split(" ")[0].toLowerCase()) > -1) {
        quantifier = str.split(" ")[0];
        str = str
            .split(" ")
            .slice(1)
            .join(" ");
    }

    // handles the matches
    const r = /((?:\d+ (?:\d+\/\d+))|(?:\d+ \d+)|(?:(?:\d+|\d+\/\d+) - (?:\d+|\d+\/\d+))|(?:\d\/\d)|\d+)((?:(?: ?\(.+\))|(?: ?[A-z,.\-\(\)]+))+)/g;
    const result = r.exec(name);

    // Check for no match
    if (result) {
        num = parseFloat(result[1].trim());
        if (num != undefined) {
            num = num;
        }
        name = result[2].trim();
    }

    let oldStr = "";
    while (name != oldStr) {
        oldStr = name;
        let obj = prune_string(name);
        if (obj["measurement"] != undefined) {
            measurement = obj["measurement"];
        }
        name = obj["name"];
    }

    return { num: num, measurement: measurement, name: name, originalText: og };
}

function stripNonAlpha(str: string): string {
    let _toRet = "";
    for (const char of str) {
        if (char.match(/[A-z]/g)) {
            _toRet += char;
        }
    }
    return _toRet;
}

/**
 * Returns the ingredients used in the given step
 * @param {string} step
 * @returns {ingredient[]}
 */
export function getIngredientsForStep(
    step: string,
    ingredients: ingredient[]
): ingredient[] {
    const usedIngr: ingredient[] = [];

    // For each ingredient
    for (const ingr of ingredients) {
        const name = ingr.name;
        let found = false;

        if (step.split(" ").indexOf(name) > -1) {
            usedIngr.push(ingr);
            found = true;
        } else {
            for (const word of name.split(" ")) {
                if (fillerWords.indexOf(word) > -1) {
                    continue;
                }
                for (const stepWord of step.split(" ")) {
                    if (
                        pluralize.singular(stripNonAlpha(stepWord)) ===
                        pluralize.singular(stripNonAlpha(word))
                    ) {
                        usedIngr.push(ingr);
                        found = true;
                        break;
                    }
                }
                if (found) {
                    break;
                }
            }
        }
    }
    console.log(step);
    console.log(usedIngr);
    console.log(ingredients);

    return usedIngr;
}
