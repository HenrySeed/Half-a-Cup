import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Recipe } from "../modules";

export function useFeaturedRecipes(max: number = 10): [Recipe[], boolean] {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(
            collection(db, "recipes"),
            where("subtitle", "!=", ""),
            limit(max)
        );

        getDocs(q).then((querySnapshot) => {
            const dbRecipes: Recipe[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                dbRecipes.push(
                    new Recipe(
                        doc.id,
                        data.title,
                        data.subtitle,
                        data.notes,
                        data.rating,
                        data.tags,
                        data.ingredients,
                        data.steps
                    )
                );
            });

            setRecipes(dbRecipes);
            setLoading(false);
        });
    }, [max]);

    return [recipes, loading];
}
