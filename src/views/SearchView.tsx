import { doc, getDoc } from "firebase/firestore";
import { Button, Typography, useTheme } from "@material-ui/core";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { db } from "../firebase";
import { HACUser, Recipe } from "../modules";
import cake from "../res/SVG/cake.svg";

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
        const words = decodedSearchVal.split(" ").slice(0, 10);
        const validIDs = Array.from(validSearchData)
            .filter(([_, val]) =>
                words.some((word) =>
                    val.toLowerCase().includes(word.toLowerCase())
                )
            )
            .map(([key]) => key);

        const output = await Promise.all(
            validIDs.map((id) =>
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
                    height: "200px",
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                }}
            >
                <Typography
                    variant="h1"
                    gutterBottom
                    color="textPrimary"
                    style={{
                        color: "white",
                        textAlign: "center",
                        padding: "0 20px",
                        paddingTop: "5vw",
                    }}
                >
                    "{decodedSearchVal}" Recipes
                </Typography>
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
                    <div style={{ marginTop: "100px" }}>
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
                                }}
                                color="textPrimary"
                            >
                                <div
                                    style={{
                                        backgroundColor:
                                            theme.palette.primary.main,
                                        width: "60vw",
                                        height: "60vw",
                                        maxWidth: "400px",
                                        maxHeight: "400px",
                                        margin: "0 auto",
                                        borderRadius: "500px",
                                    }}
                                >
                                    <img
                                        src={cake}
                                        alt=""
                                        style={{
                                            marginTop: "-6px",
                                            marginLeft: "4px",
                                            width: "60vw",
                                            maxWidth: "400px",
                                        }}
                                    />
                                </div>
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
