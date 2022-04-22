var admin = require("firebase-admin");
const serviceAccount = require("../keys/service-key.json");
const fs = require("fs");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
});

const db = admin.firestore();

function toID(val) {
    return val
        .trim()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/_/g, "-")
        .replace(/[^A-z-]|\^/g, "")
        .replace(/[^A-z-]/g, "");
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

async function main() {
    console.log("Downloading Recipes");
    const recipeSnaps = await db.collection("recipes").get();
    console.log("Done");

    const ingr = [];

    recipeSnaps.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const data = doc.data();
        if (data.id) {
            const newRecipe = new Recipe(
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

            ingr.push(...newRecipe.ingredients);
        }
    });

    fs.writeFileSync(
        "./scripts/rawIngredients.js",
        `module.exports.ingredients = \`${ingr.join("\n")}\``
    );
}

main();
