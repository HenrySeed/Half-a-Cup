const units = [
    { name: "teaspoon", alias: ["t", "ts", "tsp", "teaspoon", "teaspoons"] },
    {
        name: "tablespoon",
        alias: ["tb", "tbsp", "tbs", "tablespoon", "tablespoons"],
    },
    { name: "cup", alias: ["C", "c", "cup", "cups"] },
    { name: "ounce", alias: ["ounce", "ounces", "oz"] },
    { name: "pound", alias: ["pound", "pounds", "lb"] },
    { name: "gram", alias: ["g", "gram", "grams"] },
    { name: "Kilogram", alias: ["kg", "kilogram", "kilograms"] },
    { name: "package", alias: ["package", "pkg"] },
    { name: "mililitres", alias: ["ml", "mililitres"] },
    { name: "pinch", alias: ["pinch", "dash"] },
    { name: "small", alias: ["small"] },
    { name: "medium", alias: ["medium"] },
    { name: "large", alias: ["large", "big", "lg"] },
    { name: "to taste", alias: ["small"] },
    { name: "pint", alias: ["pint", "pints"] },
];

// units which can be prefaced by a number eg: 1 1/2 C, not 1 150g
const validMultiUnits = ["teaspoon", "tablespoon", "cup", "pinch"];

const adverbs = ["finely", "thinly"];

const ingrInstructionsRaw = [
    "peeled",
    "sliced",
    "chopped",
    "quartered",
    "lightly packed",
    "packed",
    "melted",
    "diced",
    "sifted",
    "toasted",
    "mashed",
    "softened",
    "hulled",
    "halved",
];
const allIngrInstr = ingrInstructionsRaw
    .map((instr) => [...adverbs.map((adv) => `${adv} ${instr}`), instr])
    .flat();

const ingrModifiers = [
    "nonfat",
    "boiling",
    "non fat",
    "uncooked",
    "standard",
    "tart",
    "large",
    "allpurpose",
    "lean",
    "pitted",
    "fresh",
    "frozen",
    "lukewarm",
    "room temp",
    "room temperature",
];

const fillerWords = [
    "of",
    "granulated",
    "~",
    "approximately",
    "about",
    "pack",
    "can",
    "sized",
    "heaped",
];

/**
 * The ingredient string has a number, then a unit, then an ingredient name, this returns the ingredient name
 * @export
 * @param {string} val
 */
function parseIngredient(inVal) {
    const val = inVal.toLowerCase().replace(/\./g, "");
    const ingr = {
        text: val,
        amount: "",
        unit: "",
        name: "",
        alt: "",
        details: "",
        instructions: "",
        optional: /([^A-z]|^)optional([^A-z]|$)/.test(val),
    };
    let trimmed = val.split(/,/g)[0];
    ingr.details = val.split(/,/g).slice(1).join(" ");

    // remove anything in brackets
    trimmed = trimmed.replace(/\([^)]*\)/g, "");

    // replace double spaces
    trimmed = trimmed.replace(/ {2}/g, " ");

    let words = trimmed.split(/ |-/);

    // remove filler words
    words = words.filter((word) => !fillerWords.includes(word));

    // remove leading numbers
    while (
        words[0] &&
        (/^((\d+\/\d+[A-z]*)|(\d+[A-z]*)|a|one)$/g.test(words[0]) ||
            words[0]
                .split("-")
                .every((val) =>
                    /^((\d+\/\d+[A-z]*)|(\d+[A-z]*)|a|one)$/g.test(val)
                ))
    ) {
        ingr.amount += words.splice(0, 1) + " ";
    }

    // if word is unit, remove it
    const allUnitNames = units
        .map((unit) => unit.alias)
        .flat()
        .map((val) => val.toLowerCase());

    const unit = words.find((word) => allUnitNames.includes(word));
    ingr.unit = units.find((val) => val.alias.includes(unit))?.name || "";

    words = words.filter((word) => !allUnitNames.includes(word));

    // if word is modifier, remove it
    let sentence = words.join(" ");
    for (const modifier of ingrModifiers) {
        if (new RegExp(`([^A-z]|^)${modifier}([^A-z]|$)`).test(sentence)) {
            ingr.details += " " + modifier;
            sentence = sentence.replace(
                new RegExp(`([^A-z]|^)${modifier}([^A-z]|$)`),
                "$1$2"
            );
        }
    }

    const instrParts = [];
    for (const instruction of allIngrInstr) {
        if (new RegExp(`([^A-z]|^)${instruction}([^A-z]|$)`).test(sentence)) {
            instrParts.push(instruction);
            sentence = sentence.replace(
                new RegExp(`([^A-z]|^)${instruction}([^A-z]|$)`),
                "$1$2"
            );
        }
    }
    ingr.instructions += instrParts.join(" and ");
    words = sentence.split(" ");

    // remove any hyphens
    words = words.map((val) => val.replace(/-/g, ""));

    ingr.name = words
        .map((val) => val.trim())
        .filter((val) => val !== "")
        .join(" ");

    ingr.alt = ingr.name.split(/[^A-z]or[^A-z]/)[1] || "";
    ingr.name = ingr.name.split(/[^A-z]or[^A-z]/)[0];

    if (ingr.unit && !ingr.amount) {
        ingr.amount = "1";
    }

    // if there is a for in the name, after the for is details
    if (/[^A-z]for[^A-z]/.test(ingr.name)) {
        const [newName, details] = ingr.name.split(/[^A-z]for[^A-z]/);
        ingr.name = newName;
        ingr.details += " for " + details;
    }
    if (/[^A-z]for[^A-z]/.test(ingr.alt)) {
        const [newName, details] = ingr.alt.split(/[^A-z]for[^A-z]/);
        ingr.alt = newName;
        ingr.details += " for " + details;
    }

    // remove the optional word from name
    ingr.name = ingr.name.replace(/([^A-z]|^)optional([^A-z]|$)/, "");

    // format fields of ingr
    ingr.amount = ingr.amount.trim();
    ingr.unit = ingr.unit.trim();
    ingr.name = ingr.name.replace(/[:;]/g, "").trim();
    ingr.details = ingr.details.trim();
    ingr.instructions = ingr.instructions.trim();

    return ingr;
}

module.exports.parseIngredient = parseIngredient;
