var admin = require("firebase-admin");
const serviceAccount = require("../keys/service-key.json");

const units = [
    { name: "teaspoon", alias: ["t", "tsp", "teaspoon", "teaspoons"] },
    { name: "tablespoon", alias: ["tb", "Tbsp", "tablespoon", "tablespoons"] },
    { name: "cup", alias: ["C", "c", "cup", "cups"] },
    { name: "ounce", alias: ["ounce", "ounces", "oz"] },
    { name: "pound", alias: ["pound", "pounds", "lb"] },
    { name: "gram", alias: ["g", "gram", "grams"] },
    { name: "Kilogram", alias: ["Kg", "Kilogram", "Kilograms"] },
];

const ingrModifiers = ["standard", "large", "chopped", "allpurpose", "pkg"];

function toID(val) {
    return val
        .trim()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/_/g, "-")
        .replace(/[^A-z-]|\^/g, "")
        .replace(/[^A-z-]/g, "");
}

/**
 * The ingredient string has a number, then a unit, then an ingredient name, this returns the ingredient name
 * @export
 * @param {string} val
 */
function getIngredientName(val) {
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
    const allUnitNames = units
        .map((unit) => unit.alias)
        .flat()
        .map((val) => val.toLowerCase());
    words = words.filter((word) => !allUnitNames.includes(word.toLowerCase()));

    // if word is modifier, remove it
    words = words.filter((word) => !ingrModifiers.includes(word.toLowerCase()));

    // remove any hyphens
    words = words.map((val) => val.replace(/-/g, ""));

    return words
        .map((val) => val.trim())
        .filter((val) => val !== "")
        .join(" ");
}

class Recipe {
    id;
    title;
    subtitle;
    coverImg;
    notes;
    rating;
    tags;
    ingredients;
    steps;

    constructor(
        id,
        title,
        subtitle,
        coverImg,
        notes,
        rating,
        tags,
        ingredients,
        steps
    ) {
        this.id = toID(id);
        this.title = title || "";
        this.subtitle = subtitle || "";
        this.coverImg = coverImg || "";
        this.notes = notes || "";

        this.rating = rating || 0;
        this.tags = tags.map((tag) => toID(tag));
        this.ingredients = ingredients || [];
        this.steps = steps || [];
    }

    toPlain() {
        return {
            id: this.id,
            title: this.title,
            subtitle: this.subtitle,
            notes: this.notes,
            coverImg: this.coverImg,
            tags: this.tags,
            ingredients: this.ingredients,
            steps: this.steps,
            rating: this.rating,
        };
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});

const db = admin.firestore();

/**
 * Copies recipes from recipes collection to recipedBackup collection
 */
async function backupRecipes() {
    console.log("[backupRecipes] Backing up recipes...");
    const recipeSnaps = await db.collection("recipes").get();
    recipeSnaps.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        if (data.id) {
            db.collection("recipesBackup").doc(data.id).set(data);
        }
    });
    console.log("[backupRecipes] Done");
}

function updateTags(recipe) {
    const newTags = recipe.tags;
    for (const ingr of recipe.ingredients) {
        const name = getIngredientName(ingr);
        newTags.push(name.toLowerCase());
    }
    recipe.tags = newTags
        .filter((val) => !!val)
        .filter((val) => val.split(" ").length === 1);
    return recipe;
}

async function main() {
    // start by backing up the recipes
    await backupRecipes();

    console.log("[updateRecipes] Loading Recipes...");
    // modify the data in recipes
    const recipeSnaps = await db.collection("recipes").get();
    console.log("[updateRecipes] Done");

    console.log("[updateRecipes] Updating Recipes..");

    recipeSnaps.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        if (data.id) {
            const recipe = new Recipe(
                data.id,
                data.title,
                data.subtitle,
                data.coverImg,
                data.notes,
                data.rating,
                data.tags,
                data.ingredients,
                data.steps
            );

            // run the update function over the recipe
            const updatedRecipe = updateTags(recipe);

            // save to recipes collection
            db.collection("recipes").doc(data.id).set(updatedRecipe.toPlain());
        }
    });
    console.log("[updateRecipes] Done");
}

main();
