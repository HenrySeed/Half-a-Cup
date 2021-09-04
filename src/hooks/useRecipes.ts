import { useEffect, useState } from "react";
import { Recipe } from "../modules";
import { toID } from "../utils";
import { getRecipe } from "./useRecipe";

export function useRecipes(ids: string[]): [Recipe[], boolean] {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ids && Array.isArray(ids)) {
            if (recipes.length === 0) setLoading(true);

            const newRecipes = recipes.filter((recipe) =>
                ids.includes(recipe.id)
            );
            const toDownloadIDs = ids.filter(
                (id) => !recipes.find((recipe) => recipe.id === id)
            );

            console.log(`[useRecipes] Loading ${toDownloadIDs}`);

            Promise.all(
                toDownloadIDs.map((id: string) =>
                    getRecipe(toID(id).replace(/_/g, "-"))
                )
            )
                .then((recipes) => {
                    newRecipes.push(
                        ...recipes
                            .filter((recipe) => recipe instanceof Recipe)
                            .map((recipe) => recipe as Recipe)
                    );

                    setRecipes(newRecipes);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        }
    }, [ids]);

    return [recipes, loading];
}
