import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import {
    deleteDoc,
    doc,
    getDoc,
    getFirestore,
    setDoc,
} from "firebase/firestore";
import { Recipe } from "./modules";

// Firebase setup =======================================
const config = {
    apiKey: "AIzaSyAnlTaJufGESWh80ttA3C5s9ouyIw1J-1E",
    authDomain: "wholecup-72a6b.firebaseapp.com",
    databaseURL: "https://wholecup-72a6b.firebaseio.com",
    projectId: "wholecup-72a6b",
    storageBucket: "wholecup-72a6b.appspot.com",
    messagingSenderId: "51118699872",
};
export const app = initializeApp(config);

// Firestore setup ======================================
export const db = getFirestore();

// Authentication setup =================================
export const googleAUthProvider = new GoogleAuthProvider();

// Useful functions
export async function getRecipe(id: string) {
    return getDoc(doc(db, "recipes", id)).then((docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            return new Recipe(
                docSnap.id,
                data.title,
                data.subtitle,
                data.notes || "",
                data.rating,
                data.tags,
                data.ingredients,
                data.steps
            );
        } else {
            console.error(`[getRecipe] Failed to load recipe "${id}"`);
        }
    });
}

export async function archiveRecipe(id: string) {
    // first download it
    const recipe = await getRecipe(id);
    if (!recipe) {
        return;
    }

    // now remove it from the recipes collection
    await deleteDoc(doc(db, "recipes", id));

    // now add it to the archivedRecipes collection
    await setDoc(
        doc(db, "archivedRecipes", id + "-" + Date.now().toString()),
        recipe.toPlain()
    );
}
