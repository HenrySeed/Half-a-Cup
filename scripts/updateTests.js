const { ingredients } = require("./rawIngredients");
const { parseIngredient } = require("./ingredientParser");
const fs = require("fs");

let text = [];

for (const ingr of ingredients.split("\n")) {
    const token = parseIngredient(ingr);
    text.push(`{
    text: \`${token.text}\`,
    amount: \`${token.amount}\`,
    unit: \`${token.unit}\`,
    name: \`${token.name}\`,
    alt: \`${token.alt}\`,
    details: \`${token.details}\`,
    instructions: \`${token.instructions}\`,
    optional: ${token.optional},
}`);
}

fs.writeFileSync(
    "./scripts/tests.js",
    `module.exports.tests = [
    ${text.join(",\n")}
]`
);
