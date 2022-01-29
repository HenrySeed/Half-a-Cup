import { Grid } from "@material-ui/core";
import { HACUser, Recipe } from "../modules";
import { RecipeCard } from "./RecipeCard";

export function RecipeGrid({
    user,
    recipes,
    ordered,
}: {
    user: HACUser | null;
    recipes: Recipe[];
    ordered?: boolean;
}) {
    // cose one recipe with a cover to be the cover tile
    const coverRecipes = recipes.filter((val) => val.coverImg);
    const coverRecipe =
        !ordered &&
        coverRecipes[Math.floor(Math.random() * coverRecipes.length)];

    let sideRecipes: Recipe[] = [];
    let regRecipes = recipes.filter((val) => val !== coverRecipe);

    if (coverRecipe) {
        sideRecipes = regRecipes.slice(0, 2);
        regRecipes = regRecipes.slice(2);
    }

    return (
        <Grid container spacing={6}>
            {coverRecipe && (
                <>
                    <Grid item container xs={12} md={8}>
                        <Grid item xs={12}>
                            <RecipeCard user={user} recipe={coverRecipe} wide />
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        item
                        xs={12}
                        sm={12}
                        md={4}
                        direction="row"
                        spacing={6}
                        style={{ padding: 0, margin: "0" }}
                    >
                        {sideRecipes.map((recipe, i) => (
                            <Grid item key={i} xs={12} sm={6} md={12}>
                                <RecipeCard user={user} recipe={recipe} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
            {regRecipes.map((recipe, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                    <RecipeCard user={user} recipe={recipe} />
                </Grid>
            ))}
        </Grid>
    );
}
