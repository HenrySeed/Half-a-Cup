import {
    getIngredientsForStep,
    split_num_ingredient,
    ingredient
} from "./recipeUtilities";

const testIngredients = [
    "2 cups self-raising flour",
    "1/2 cup castor sugar",
    "1/2 cup chocolate chips",
    "1/2 tsp salt",
    "100g butter",
    "1 cup milk",
    "1 large egg",
    "1 tsp vanilla",
    "1 cup (2-3) mashed bananas"
];
const testSteps = [
    "Heat oven to 220\u00b0C (210\u00b0C fanbake), with the rack just below the middle.",
    "With a fork, stir the flour, castor sugar, chocolate chips and salt together in a large bowl.",
    "Melt the butter in another large bowl, remove from the heat, then add the milk, egg and vanilla and beat well.",
    "Mash and measure the bananas, then stir them into the liquid.",
    "Tip all the flour mixture into the bowl with the liquid mixture.",
    "Fold everything together carefully until all the flour is dampened, stopping before the mixture is smooth",
    "Spray 12 regular muffin pans with nonstick spray. Put about 1/4 cup of mixture into each cup.",
    "Bake for 12\u00e2\u20ac\u201d15 minutes, until muffins spring back when pressed in the centre."
];

let ingredients: ingredient[] = [];

for (const i of testIngredients) {
    ingredients.push(split_num_ingredient(i));
}

for (const step of testSteps) {
    const ingr = getIngredientsForStep(step, ingredients);
    ingredients = ingredients.filter(val => ingr.indexOf(val) < 0);

    let ingrs = "";
    for (const ingrObj of ingr) {
        ingrs += `${ingrObj.num} ${ingrObj.measurement} ${ingrObj.name} \n`;
    }

    // console.log(step);
    // console.log("");
    // console.log(ingrs);
    // console.log("-----------------------------\n");
}
