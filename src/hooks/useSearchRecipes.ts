import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, getRecipe } from "../firebase";
import { Recipe } from "../modules";
import { toID } from "../utils";

export function useSearchRecipes(search: string[]): [Recipe[], boolean] {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    const searchVal = search[0];

    useEffect(() => {
        if (searchVal === undefined) {
            return;
        }

        console.log(`[useSearchRecipes] loading`);

        setLoading(true);
        const docRef = doc(db, "tags", toID(searchVal));
        getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                Promise.all(
                    data.recipesIDs.map((id: string) => getRecipe(id))
                ).then((recipes) => {
                    const DBrecipes: Recipe[] = recipes
                        .filter((recipe) => recipe instanceof Recipe)
                        .map((recipe) => recipe as Recipe);

                    setRecipes(DBrecipes);
                    setLoading(false);
                });
            } else {
                console.error(
                    `[useSearchRecipes] Failed to load Search phrase "${searchVal}"`
                );
            }
        });
    }, [searchVal]);

    return [recipes, loading];
}
