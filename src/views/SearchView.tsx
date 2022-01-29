import {
    getDocs,
    query,
    collection,
    DocumentSnapshot,
} from "@firebase/firestore";
import { Button, Typography, useTheme } from "@material-ui/core";
import { where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { db } from "../firebase";
import { HACUser, Recipe } from "../modules";

export function SearchView({ user }: { user: HACUser | null }) {
    let { searchVal } = useParams<{ searchVal: string }>();
    const theme = useTheme();
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(false);

    const decodedSearchVal = decodeURIComponent(searchVal);

    async function searchRecipes() {
        setLoading(true);
        const words = decodedSearchVal.split(" ").slice(0, 10);
        const output = (
            await Promise.all(
                words.map((val) =>
                    getDocs(
                        query(
                            collection(db, "recipes"),
                            where("tags", "array-contains", val)
                        )
                    ).then((querySnapshot) => {
                        const dbRecipes: Recipe[] = [];
                        querySnapshot.forEach((doc) => {
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
                        return dbRecipes;
                    })
                )
            )
        ).flat();
        setLoading(false);
        setRecipes(output);
    }

    useEffect(() => {
        searchRecipes();
    }, [searchVal]);

    return (
        <>
            <div
                className="bgBanner"
                style={{
                    backgroundColor: theme.palette.primary.main,
                    height: "150px",
                }}
            ></div>
            <div
                style={{
                    position: "relative",
                    maxWidth: "1400px",
                    width: "90%",
                    margin: "5vh auto 5vh auto",
                }}
            >
                <Typography
                    variant="h2"
                    gutterBottom
                    style={{ color: "white" }}
                >
                    Results for "{decodedSearchVal}"
                </Typography>
                {loading ? (
                    <CenteredProgress style={{ marginTop: "10vh" }} />
                ) : (
                    <div style={{ marginTop: "100px" }}>
                        <RecipeGrid recipes={recipes} user={user} ordered />
                        {recipes.length === 0 && (
                            <Typography
                                variant="body1"
                                style={{
                                    width: "400px",
                                    textAlign: "center",
                                    margin: "10vh auto",
                                }}
                            >
                                I'm sorry, we couldnt find any recipes matching{" "}
                                "{searchVal}". You can see all our recipes on
                                our home page <br />
                                <br />
                                <Link to="/">
                                    <Button>Home</Button>
                                </Link>
                            </Typography>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
