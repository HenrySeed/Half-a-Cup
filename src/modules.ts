import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { toID } from "./utils";

export class Recipe {
    id: string;
    title: string;
    subtitle: string;
    tags: string[];
    ingredients: string[];
    steps: string[];
    rating: number;

    constructor(
        id: string,
        title: string,
        subtitle: string,
        tags: string[],
        ingredients: string[],
        steps: string[],
        rating: number
    ) {
        // we need to trim whitespace off tags
        const cleanTags = [];
        for (const tag of tags) {
            cleanTags.push(tag.trim());
        }

        this.id = toID(id).replace(/_/g, "-");
        this.title = title;
        this.subtitle = subtitle;
        this.rating = rating;

        this.tags = cleanTags;
        this.ingredients = ingredients;
        this.steps = steps;
    }

    public toPlain() {
        return {
            id: this.id,
            title: this.title,
            subtitle: this.subtitle,
            tags: JSON.stringify(this.tags),
            ingredients: JSON.stringify(this.ingredients),
            steps: JSON.stringify(this.steps),
            rating: this.rating,
        };
    }
}

export class HACUser {
    uid: string;
    email: string;
    displayName: string;
    savedRecipes: { id: string; date: number }[];

    constructor(
        uid: string,
        savedRecipes: { id: string; date: number }[],
        email: string = "",
        displayName: string = ""
    ) {
        this.savedRecipes = savedRecipes;
        this.uid = uid;
        this.email = email;
        this.displayName = displayName;
    }

    public clone() {
        return new HACUser(
            this.uid,
            [...this.savedRecipes],
            this.email,
            this.displayName
        );
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
            savedRecipes: JSON.stringify(this.savedRecipes),
        };
    }
}
