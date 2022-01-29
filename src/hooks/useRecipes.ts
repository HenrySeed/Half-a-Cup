import { useEffect, useState } from "react";
import { getRecipe } from "../firebase";
import { Recipe } from "../modules";
import { toID } from "../utils";

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

            if (toDownloadIDs.length === 0) {
                return;
            }

            // console.log(
            //     `[useRecipes] Loading ${toDownloadIDs.length} recipes(s)`
            // );

            Promise.all(toDownloadIDs.map((id: string) => getRecipe(toID(id))))
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
    }, [ids, recipes]);

    return [recipes, loading];
}
