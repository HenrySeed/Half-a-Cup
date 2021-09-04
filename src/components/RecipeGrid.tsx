import { Grid } from "@material-ui/core";
import { HACUser, Recipe } from "../modules";
import { RecipeCard } from "./RecipeCard";

export function RecipeGrid({
    user,
    recipes,
}: {
    user: HACUser | null;
    recipes: Recipe[];
}) {
    return (
        <Grid container spacing={3}>
            {recipes.map((recipe, i) => (
                <Grid key={i} item xs={12} sm={6} md={4}>
                    <RecipeCard user={user} recipe={recipe} />
                </Grid>
            ))}
        </Grid>
    );
}
