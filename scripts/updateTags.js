var admin = require("firebase-admin");
const serviceAccount = require("../keys/service-key.json");

class Recipe {
    id;
    title;
    subtitle;
    tags;
    ingredients;
    steps;
    rating;

    constructor(id, title, subtitle, tags, ingredients, steps, rating) {
        // we need to trim whitespace off tags
        const cleanTags = [];
        for (const tag of tags) {
            cleanTags.push(tag.trim());
        }

        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.tags = cleanTags;
        this.ingredients = ingredients;
        this.steps = steps;
        this.rating = rating;
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});

const db = admin.firestore();

function toID(val) {
    return val
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^A-z-]|\^/g, "");
}

async function main() {
    const allRecipes = [];
    // downlaod all recipes
    const recipeSnaps = await db.collection("recipes2").get();
    recipeSnaps.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        allRecipes.push(
            new Recipe(
                toID(data.title),
                data.title || "",
                data.subtitle || "",
                data.notes || "",
                data.tags || [],
                data.ingredients || [],
                data.steps || [],
                data.rating || 0
            )
        );
    });

    console.log(allRecipes);
    for (const recipe of allRecipes) {
        db.collection("recipes").doc(recipe.id).set({
            id: recipe.id,
            title: recipe.title,
            subtitle: recipe.subtitle,
            tags: recipe.tags,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            rating: recipe.rating,
        });
    }

    // const tagMap = new Map();
    // for (const recipe of allRecipes) {
    //     for (const recipeTag of recipe.tags) {
    //         const tag = toID(recipeTag);
    //         tagMap.set(tag, [recipe.id, ...(tagMap.get(tag) || [])]);
    //     }
    // }

    // for (const [key, value] of Array.from(tagMap.entries())) {
    //     db.collection("tags").doc(key).set({ recipesIDs: value });
    // }
}

main();
