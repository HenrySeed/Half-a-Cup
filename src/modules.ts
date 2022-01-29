import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toID } from "./utils";

export const units = [
    { name: "teaspoon", alias: ["tsp", "teaspoon", "teaspoons"] },
    { name: "tablespoon", alias: ["Tbsp", "tablespoon", "tablespoons"] },
    { name: "cup", alias: ["C", "cup", "cups"] },
    { name: "gram", alias: ["g", "gram", "grams"] },
    { name: "Kilogram", alias: ["Kg", "Kilogram", "Kilograms"] },
];

export const ingrModifiers = ["standard", "large", "chopped"];

export class Recipe {
    id: string;
    title: string;
    subtitle: string;
    coverImg: string;
    notes: string;

    rating: number;
    tags: string[];

    ingredients: string[];
    steps: string[];

    constructor(
        id: string,
        title: string,
        subtitle: string,
        coverImg: string,
        notes: string,
        rating: number,
        tags: string[],
        ingredients: string[],
        steps: string[]
    ) {
        this.id = toID(id);
        this.title = title;
        this.subtitle = subtitle;
        this.coverImg = coverImg || "";
        this.notes = notes;

        this.rating = rating;
        this.tags = tags.map((tag) => toID(tag));
        this.ingredients = ingredients;
        this.steps = steps;
    }

    public toPlain() {
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

export class HACUser {
    uid: string;
    email: string;
    displayName: string;
    savedRecipes: { id: string; date: number }[];
    accountCreated: number;

    constructor(uid: string, data: any) {
        this.uid = uid;

        this.savedRecipes = data.savedRecipes || [];
        this.email = data.email || "";
        this.displayName = data.displayName || "";
        this.accountCreated = data.accountCreated || Date.now();
    }

    public isAdmin() {
        return this.uid === "bWcWTtHgkJaw0RK2EPqIV9KKUfw2";
    }

    public clone() {
        return new HACUser(this.uid, {
            savedRecipes: this.savedRecipes,
            email: this.email,
            displayName: this.displayName,
            accountCreated: this.accountCreated,
        });
    }

    public favRecipe(id: string) {
        console.log(`[favRecipe] Favouriting ${id}`);
        if (!this.hasSaved(id)) {
            this.savedRecipes.push({ id: id, date: Date.now() });

            const docRef = doc(db, "Users", this.uid);
            setDoc(docRef, this.toPlain());
        }
    }

    public unFavRecipe(id: string) {
        console.log(`[unFavRecipe] Unfavouriting ${id}`);
        const index = this.savedRecipes.findIndex((val) => val.id === id);
        if (index > -1) {
            this.savedRecipes.splice(index, 1);
            const docRef = doc(db, "Users", this.uid);
            setDoc(docRef, this.toPlain());
        }
    }

    public hasSaved(id: string) {
        return this.savedRecipes.some((recipe) => recipe.id === id);
    }

    public toPlain() {
        return {
            uid: this.uid,
            savedRecipes: this.savedRecipes,
            email: this.email,
            displayName: this.displayName,
        };
    }
}
