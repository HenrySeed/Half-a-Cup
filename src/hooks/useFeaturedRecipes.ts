import {
    collection,
    DocumentSnapshot,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { Recipe } from "../modules";

export function useFeaturedRecipes(): [Recipe[], boolean, () => void] {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastDocSnap, setLastDocSnap] = useState<
        DocumentSnapshot | undefined
    >(undefined);

    useEffect(() => {
        handleLoadMore();
    }, []);

    function handleLoadMore() {
        setLoading(true);
        let q = query(
            collection(db, "recipes"),
            orderBy("coverImg", "desc"),
            orderBy("subtitle", "desc"),
            limit(12)
        );

        if (lastDocSnap) {
            q = query(
                collection(db, "recipes"),
                orderBy("coverImg", "desc"),
                orderBy("subtitle", "desc"),
                startAfter(lastDocSnap),
                limit(12)
            );
        }

        getDocs(q).then((querySnapshot) => {
            const dbRecipes: Recipe[] = [];
            let thisDocSnap: DocumentSnapshot | undefined = undefined;

            querySnapshot.forEach((doc) => {
                thisDocSnap = doc;
                const data = doc.data();
                dbRecipes.push(
                    new Recipe(
                        doc.id,
                        data.title,
                        data.subtitle,
                        data.coverImg,
                        data.notes,
                        data.rating,
                        data.tags,
                        data.ingredients,
                        data.steps
                    )
                );
            });

            setLastDocSnap(thisDocSnap);
            setRecipes([...recipes, ...dbRecipes]);
            setLoading(false);
        });
    }

    return [recipes, loading, handleLoadMore];
}
