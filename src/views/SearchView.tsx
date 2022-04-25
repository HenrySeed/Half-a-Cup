import { doc, getDoc } from "firebase/firestore";
import { Button, Typography, useTheme } from "@material-ui/core";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { db } from "../firebase";
import { HACUser, Recipe } from "../modules";
import cake from "../res/SVG/cooking_4.svg";
import "./SearchView.css";

export function SearchView({
    user,
    searchData,
}: {
    user: HACUser | null;
    searchData: Map<string, string> | null;
}) {
    let { searchVal } = useParams<{ searchVal: string }>();
    const theme = useTheme();
    const [recipes, setRecipes] = useState<Recipe[] | null>(null);
    const [loading, setLoading] = useState(true);
    const decodedSearchVal = decodeURIComponent(searchVal);

    async function searchRecipes(validSearchData: Map<string, string>) {
        setLoading(true);

        // make a priority queue for recipes matching words
        const validIDMap: Map<string, string[]> = new Map();
        for (const word of decodedSearchVal.split(" ")) {
            for (const [id, val] of Array.from(validSearchData)) {
                if (val.toLowerCase().includes(word.toLowerCase())) {
                    validIDMap.set(id, [...(validIDMap.get(id) || []), word]);
                }
            }
        }

        // sort recipes by how many times they match the search
        const sortedIDs = Array.from(validIDMap).sort(
            ([_a, awords], [_b, bwords]) => bwords.length - awords.length
        );

        console.log(sortedIDs);

        // load each matching recipe
        const output = await Promise.all(
            sortedIDs.map(([id]) =>
                getDoc(doc(db, "recipes", id)).then((docSnap) => {
                    const data = docSnap.data();
                    return new Recipe(
                        data?.id || "",
                        data?.title || "",
                        data?.subtitle || "",
                        data?.coverImg || "",
                        data?.notes || "",
                        data?.rating || "",
                        data?.tags || [],
                        data?.ingredients || [],
                        data?.steps || []
                    );
                })
            )
        );

        setLoading(false);
        setRecipes(output);
    }

    useEffect(() => {
        if (searchData !== null && searchVal.trim() !== "") {
            searchRecipes(searchData);
        }
    }, [searchVal, searchData]);

    return (
        <>
            <div
                style={{
                    backgroundColor: theme.palette.primary.main,
                    height: "300px",
                }}
            >
                <div
                    style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        maxWidth: "1000px",
                        width: "90%",
                    }}
                >
                    <div className="searchTitleContainer">
                        <Typography
                            variant="h1"
                            gutterBottom
                            color="textPrimary"
                            className="searchTitle"
                        >
                            "{decodedSearchVal}" Recipes
                        </Typography>
                    </div>
                    <img src={cake} alt="" className="searchImg" />
                </div>
            </div>
            <div
                style={{
                    position: "relative",
                    maxWidth: "1400px",
                    width: "90%",
                    margin: "100px auto 5vh auto",
                }}
            >
                {loading ? (
                    <CenteredProgress
                        style={{
                            marginTop: "10vh",
                            color: theme.palette.primary.main,
                        }}
                    />
                ) : (
                    <div className="searchRecipeContainer">
                        {recipes && (
                            <RecipeGrid recipes={recipes} user={user} ordered />
                        )}
                        {recipes && recipes.length === 0 && (
                            <Typography
                                variant="body1"
                                style={{
                                    maxWidth: "600px",
                                    textAlign: "center",
                                    margin: "1vh auto",
                                    fontSize: "16pt",
                                }}
                                color="textPrimary"
                            >
                                I'm sorry, I couldnt find "{searchVal}" in any
                                of our recipes. You can browse all recipes on
                                the home page <br />
                                <br />
                                <Link to="/">
                                    <Button
                                        style={{
                                            borderColor:
                                                theme.palette.text.primary,
                                            fontSize: "12pt",
                                            padding: "8px 18px",
                                        }}
                                    >
                                        Home
                                    </Button>
                                </Link>
                            </Typography>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
