import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Recipe } from "../modules";

export async function getRecipe(id: string) {
    const docRef = doc(db, "recipes", id);
    console.log(`[ getRecipe ] loading "${id}"`);

    return getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            return new Recipe(
                docSnap.id,
                data.title,
                data.subtitle,
                data.tags,
                data.ingredients,
                data.steps,
                data.rating
            );
        } else {
            console.error(`[ getRecipe ] Failed to load recipe "${id}"`);
        }
    });
}

export function useRecipe(id: string): [Recipe | null, boolean] {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRecipe(id).then((recipe) => {
            if (recipe) {
                setRecipe(recipe);
            }
            setLoading(false);
        });
    }, [id]);

    return [recipe, loading];
}
