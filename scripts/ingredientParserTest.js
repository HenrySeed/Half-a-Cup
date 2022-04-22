const { parseIngredient } = require("./ingredientParser");
const { tests } = require("./tests.js");

let errorCount = 0;
for (const test of tests) {
    const ingr = parseIngredient(test.text);
    for (const field in ingr) {
        if (ingr[field] !== test[field]) {
            errorCount += 1;
            console.table([
                { status: "EXPECTED", ...test },
                { status: "RESULT", ...ingr },
            ]);
        }
    }
}

console.log(`${errorCount} Tests Failed`);
