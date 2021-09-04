import { Typography, useTheme } from "@material-ui/core";
import { useEffect, useState } from "react";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { useFeaturedRecipes } from "../hooks/useFeaturedRecipes";
import { useRecipes } from "../hooks/useRecipes";
import { HACUser } from "../modules";
import cook1 from "../res/SVG/cooking_1.svg";
import cook2 from "../res/SVG/cooking_2.svg";
import { getRandFromArray } from "../utils";
import "./HomeView.css";

export function HomeView({ user }: { user: HACUser | null }) {
    const [recipes, loadingRecipes] = useFeaturedRecipes();

    const [recipeIDs, setRecipeIDs] = useState<string[]>([]);
    const [savedRecipes, loadingSavedRecipes] = useRecipes(recipeIDs);
    const theme = useTheme();

    const cookImgs = [cook1, cook2];
    const [cookImg] = useState(getRandFromArray(cookImgs));

    useEffect(() => {
        if (user) {
            setRecipeIDs(user.savedRecipes.map((val) => val.id));
        }
    }, [user]);

    return (
        <>
            <div
                style={{ backgroundColor: theme.palette.primary.main }}
                className="dashBanner"
            >
                <div className="dashBannerContainer">
                    <img src={cookImg} alt="" />
                    <div className="bannerText">
                        <Typography variant="h1" className="logo">
                            Half a Cup
                        </Typography>
                        <Typography
                            variant="h5"
                            style={{ maxWidth: "200px", float: "right" }}
                        >
                            Helping to make cooking simpler
                        </Typography>
                    </div>
                </div>
            </div>
            {user && user.savedRecipes.length > 0 && (
                <div
                    style={{
                        maxWidth: "1000px",
                        width: "90%",
                        margin: "50px auto 100px auto",
                    }}
                >
                    {loadingSavedRecipes ? (
                        <CenteredProgress style={{ marginTop: "200px" }} />
                    ) : (
                        <>
                            <Typography
                                variant="h3"
                                style={{
                                    position: "relative",
                                    color: "white",
                                    marginBottom: "10px",
                                    textAlign: "right",
                                }}
                            >
                                Your Saved Recipes
                            </Typography>
                            <RecipeGrid user={user} recipes={savedRecipes} />
                        </>
                    )}
                </div>
            )}

            <div
                style={{
                    maxWidth: "1000px",
                    width: "90%",
                    margin: "50px auto 100px auto",
                }}
            >
                {loadingRecipes ? (
                    <CenteredProgress style={{ marginTop: "200px" }} />
                ) : (
                    <>
                        <Typography
                            variant="h3"
                            style={{
                                position: "relative",
                                marginBottom: "20px",
                                color:
                                    user && user.savedRecipes.length > 0
                                        ? "inherit"
                                        : "white",
                                textAlign: "right",
                            }}
                        >
                            Featured Recipes
                        </Typography>
                        <RecipeGrid user={user} recipes={recipes} />
                    </>
                )}
            </div>
        </>
    );
}
