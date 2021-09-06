import { useEffect, useState } from "react";
import { getRecipe } from "../firebase";
import { Recipe } from "../modules";

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
