import { Button, Divider, Grid, Typography, useTheme } from "@material-ui/core";
import { Favorite, Star } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { CenteredProgress } from "../components/CenteredProgress";
import { RecipeGrid } from "../components/RecipeGrid";
import { useRecipes } from "../hooks/useRecipes";
import { HACUser } from "../modules";
import cook1 from "../res/SVG/cooking_1.svg";
import cook2 from "../res/SVG/cooking_2.svg";
import { getRandFromArray } from "../utils";
import "./HomeView.css";
import { useFeaturedRecipes } from "../hooks/useFeaturedRecipes";
import { AnimatedLogo } from "../components/AnimatedLogo";

export function HomeView({ user }: { user: HACUser | null }) {
    const [recipes, loadingRecipes, handleLoadMore] = useFeaturedRecipes();

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
                    <img src={cookImg} alt="" className="coverImg" />
                    <div className="bannerText">
                        <AnimatedLogo />
                    </div>
                </div>
            </div>
            {user && user.savedRecipes.length > 0 && (
                <div
                    style={{
                        maxWidth: "1400px",
                        width: "90%",
                        margin: "50px auto 100px auto",
                    }}
                >
                    {loadingSavedRecipes ? (
                        <CenteredProgress style={{ marginTop: "200px" }} />
                    ) : (
                        <>
                            <Typography
                                variant="h2"
                                color="primary"
                                style={{
                                    position: "relative",
                                    marginBottom: "20px",
                                }}
                            >
                                <Favorite
                                    style={{
                                        margin: "5px 10px -7px 0",
                                        fontSize: "32pt",
                                    }}
                                />
                                Saved Recipes
                            </Typography>
                            <RecipeGrid
                                user={user}
                                recipes={savedRecipes.filter((recipe) =>
                                    recipeIDs.includes(recipe.id)
                                )}
                            />
                            <Divider style={{ marginTop: "80px" }} />
                        </>
                    )}
                </div>
            )}

            <div
                style={{
                    maxWidth: "1400px",
                    width: "90%",
                    margin: "50px auto 100px auto",
                }}
            >
                <Typography
                    variant="h2"
                    color="primary"
                    style={{
                        position: "relative",
                        marginBottom: "20px",
                    }}
                >
                    <Star
                        style={{
                            margin: "5px 10px -7px 0",
                            fontSize: "32pt",
                        }}
                    />
                    Featured Recipes
                </Typography>
                {recipes.length > 0 && (
                    <RecipeGrid user={user} recipes={recipes} />
                )}
                {loadingRecipes ? (
                    <CenteredProgress style={{ marginTop: "200px" }} />
                ) : (
                    <Grid container justifyContent="center">
                        <Button
                            style={{ marginTop: "100px" }}
                            disabled={loadingRecipes}
                            onClick={handleLoadMore}
                        >
                            Load More
                        </Button>
                    </Grid>
                )}
            </div>
        </>
    );
}
